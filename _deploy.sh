cd book-website
git rm -rf *
cp -r ../_book/* ./
git add --all *
git commit -m "Update course website"
git push -q origin gh-pages
