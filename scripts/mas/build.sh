#!/bin/bash

set -ex

APP="Fire Sale"

electron-packager . \
  "$APP" \
  --asar \
  --overwrite \
  --platform=mas \
  --app-bundle-id=net.stevekinney.firesale \
  --app-version="$npm_package_version" \
  --build-version="1.0.0" \
  --arch=x64 \
  --icon=icons/Icons.icns \
  --out=build \
  --extend-info=scripts/mas/info.plist

APP_PATH="./build/$APP-mas-x64/$APP.app"
RESULT_PATH="./build/$APP.pkg"
APP_KEY="3rd Party Mac Developer Application: Turing School of Software and Design (XD3V298ZRK)"
INSTALLER_KEY="3rd Party Mac Developer Installer: Turing School of Software and Design (XD3V298ZRK)"
FRAMEWORKS_PATH="$APP_PATH/Contents/Frameworks"
CHILD_PLIST="./scripts/mas/child.plist"
PARENT_PLIST="./scripts/mas/parent.plist"

codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Electron Framework"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libnode.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper.app/Contents/MacOS/$APP Helper"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper.app/"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper EH.app/Contents/MacOS/$APP Helper EH"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper EH.app/"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper NP.app/Contents/MacOS/$APP Helper NP"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper NP.app/"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$APP_PATH/Contents/MacOS/$APP"

codesign -s "$APP_KEY" -f --entitlements "$PARENT_PLIST" "$APP_PATH"

productbuild --component "$APP_PATH" /Applications --sign "$INSTALLER_KEY" "$RESULT_PATH"