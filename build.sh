echo "Start the building for DEV site.."
echo "Clear previous pages."
rm -rf pages/*
echo "Start building the pages from contents."
node scripts/build.js
echo "Completed"
