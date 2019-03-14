# 上传代码检查域名
for line in `cat ../src/config.js`
do
result=$(echo $line | grep "dev")$(echo $line | grep "uat")
if [[ "$result" != "" ]]
then
  echo "";
  echo "[错误] 上传代码需要正式域名";
  echo "";
  exit 42;
fi
done

# 检查分支是否为生产环境分支
brand=$(git symbolic-ref --short HEAD);
if [ $brand != "prod" ]
then
  echo "";
  echo "[错误] 当前分支名为「$brand」,上传包必须是在「prod」分支";
  echo "";
  exit 42;
fi

# 检查分支上是否有未提交的代码
if [[ ! -z $(git status --porcelain) ]]
then
  echo "";
  echo "[错误] 你有未提交的代码，上传包前请将代码提交到仓库";
  echo "";
  exit 42;
fi