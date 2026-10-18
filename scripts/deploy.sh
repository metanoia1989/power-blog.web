#!/usr/bin/env bash
#
# 把 dist/ 部署到服务器。
# 前端是纯静态 SPA，nginx 直接从磁盘读文件，所以不需要重启任何进程。
#
# 用法：
#   yarn build && ./scripts/deploy.sh bigubuntu    # 测试机
#   yarn build && ./scripts/deploy.sh hostwinds    # 生产机
#
set -euo pipefail

TARGET="${1:-}"
case "$TARGET" in
    bigubuntu) WEB_ROOT=/www/wwwroot/powerblog.bigubuntu.internal ;;
    hostwinds) WEB_ROOT=/www/wwwroot/www.mysticalpower.uk ;;
    *)
        echo "用法: $0 <bigubuntu|hostwinds>" >&2
        exit 1
        ;;
esac

cd "$(dirname "$0")/.."

if [ ! -d dist ]; then
    echo "dist/ 不存在，请先执行 yarn build" >&2
    exit 1
fi

STAGE=/tmp/powerblog-dist

echo "==> 同步 dist/ 到 $TARGET:$STAGE"
rsync -az --delete dist/ "$TARGET:$STAGE/"

echo "==> 写入站点目录 $WEB_ROOT"
# 注意：
#   .user.ini 是宝塔生成的、带 chattr +i 的文件，--delete 删不掉 chown 也改不了，必须排除；
#   404.html / 502.html 是 nginx error_page 用的，站点目录里要留着。
ssh "$TARGET" "set -e
sudo rsync -a --delete \
    --exclude=.user.ini \
    --exclude=.htaccess \
    --exclude=404.html \
    --exclude=502.html \
    '$STAGE/' '$WEB_ROOT/'
sudo find '$WEB_ROOT' -not -name '.user.ini' -exec chown www:www {} +"

echo "==> 完成。nginx 直接读取新文件，无需 reload 或重启。"
