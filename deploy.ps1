

# abort on errors
#set -e

# build
yarn build

# navigate into the build output directory
$currentPath = pwd
cd src/.vuepress/dist

# if you are deploying to a custom domain
echo 'docs.passwordless.dev' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/passwordless/docs.git main:gh-pages

cd $currentPath