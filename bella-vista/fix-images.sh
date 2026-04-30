#!/bin/bash
# fix-images.sh — test alle menuafbeeldingen en rapporteer welke niet laden

HTML="index.html"
BASE="https://images.unsplash.com/photo-"
PARAMS="?auto=format&fit=crop&w=10&q=10"

echo "======================================"
echo " Bella Vista — Menu afbeelding check"
echo "======================================"
echo ""

# Extract alt + id pairs in order
mapfile -t ALTS < <(grep -o 'alt="[^"]*"' "$HTML" | grep -v "Sfeervolle\|Warm\|Italiaanse\|Pasta\|Sfeer\|Diner\|reviewer\|reviewer" | sed 's/alt="//;s/"//')
mapfile -t IDS  < <(grep -o 'photo-[^?\"]*' "$HTML" | grep -v "hero-bg\|image-frame\|wine-banner\|photo-strip\|reviewer" | sort -u | sed 's/photo-//')

# Parse menu cards: alt text and photo ID together
echo "Gerecht                              | Status | HTTP | ID"
echo "-------------------------------------|--------|------|-----------------------------"

while IFS= read -r line; do
    if [[ $line =~ menu-card-img ]]; then
        in_card=1
    fi
    if [[ $in_card -eq 1 && $line =~ photo-([^\?\"]+) ]]; then
        photo_id="${BASH_REMATCH[1]}"
    fi
    if [[ $in_card -eq 1 && $line =~ alt=\"([^\"]+)\" ]]; then
        alt_text="${BASH_REMATCH[1]}"
        # Test the URL
        url="${BASE}${photo_id}${PARAMS}"
        http_code=$(curl -o /dev/null -s -w "%{http_code}" --max-time 8 "$url")
        if [[ "$http_code" == "200" ]]; then
            status="✓ OK  "
        elif [[ "$http_code" == "302" || "$http_code" == "301" ]]; then
            status="→ REDIR"
        else
            status="✗ FAIL"
        fi
        printf "%-37s| %s | %s  | %s\n" "$alt_text" "$status" "$http_code" "$photo_id"
        in_card=0
        photo_id=""
        alt_text=""
    fi
done < "$HTML"

echo ""
echo "Klaar."
