cd /usr/share/nginx/html/360.briztech.co.uk/files
rm files.txt
ls -I "*.txt" -I "*.sh" -I "*.php" -r > files.txt
echo "File List Created"