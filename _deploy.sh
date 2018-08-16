rm -rf book-output
git clone -b gh-pages \
    git@github.com:loicseguin/nyc.git \
    book-output
cd book-output
git rm -rf *
cp -r ../_book/* ./
git add --all *
git commit -m "Update course website"
git push -q origin gh-pages
