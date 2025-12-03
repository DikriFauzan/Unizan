#!/usr/bin/env bash
set -e
WORKDIR=~/dikri/feac_build
OUT="$WORKDIR/FEAC-unsigned.apk"
SIGNED="$WORKDIR/FEAC-signed.apk"
KEY="$WORKDIR/feac-key.keystore"

cd "$WORKDIR"

# sanity checks
if [ ! -f classes.dex ]; then
  echo "ERROR: classes.dex not found in $WORKDIR. Place /sdcard/Documents/Dikri/FEAC/native/classes.dex here or generate it."
  exit 2
fi
if [ ! -f AndroidManifest.xml ]; then
  echo "ERROR: AndroidManifest.xml not found in $WORKDIR."
  exit 2
fi

# remove previous
rm -f "$OUT" "$SIGNED"

# create basic apk (aapt should be present)
aapt package -f -M AndroidManifest.xml -S dummy_res -I "$PREFIX/share/aapt/android.jar" -F "$OUT"

# add dex
zip -j "$OUT" classes.dex

# create debug keystore if missing
if [ ! -f "$KEY" ]; then
  echo "creating debug keystore..."
  keytool -genkeypair -v -keystore "$KEY" -alias feac -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android -dname "CN=FEAC,O=FEAC,C=ID" || true
fi

# sign
apksigner sign --ks "$KEY" --ks-pass pass:android --key-pass pass:android --out "$SIGNED" "$OUT"

# verify
apksigner verify "$SIGNED" && echo "APK signed: $SIGNED"
echo "Done."
