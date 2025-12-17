#!/bin/bash

# Determine the correct sed -i syntax based on OS
if [[ "$(uname)" == "Darwin" ]]; then
  # macOS (BSD sed)
  SED_INPLACE="sed -i ''"
else
  # Linux (GNU sed)
  SED_INPLACE="sed -i"
fi

# 生产环境启动脚本
# 使用 PM2 管理 Platform 服务，构建 React App 静态文件

set -e

echo "🚀 启动 Dify Chat 生产环境..."

# 检查必要工具
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装，正在安装..."
    npm install -g pnpm
fi


# 安装依赖
echo "📦 安装依赖..."
pnpm install --frozen-lockfile

# 构建基础包
echo "🔨 构建基础包..."
pnpm build:pkgs

# 构建 React App
echo "🏗️ 构建 React App..."
cd packages/react-app

# 优先使用 .env.prod 作为正式环境配置（不会修改该文件）
ENV_FILE=".env.prod"
if [ -f "$ENV_FILE" ]; then
	echo "使用正式环境配置文件 $ENV_FILE 加载环境变量..."
	# 导出到当前 shell，供 pnpm build 及后续 sed 使用
	set -a
	. "$ENV_FILE"
	set +a
else
	echo "⚠️ 未找到 $ENV_FILE，使用本地默认地址 http://localhost:5300/api/client"
fi

pnpm build

echo "🔄 替换 React App 环境变量..."

# 如果 .env.prod 中未设置，则回退到 localhost 默认值
PUBLIC_APP_API_BASE=${PUBLIC_APP_API_BASE:-"http://localhost:5300/api/client"}
PUBLIC_DIFY_PROXY_API_BASE=${PUBLIC_DIFY_PROXY_API_BASE:-"http://localhost:5300/api/client/dify"}
PUBLIC_DEBUG_MODE=${PUBLIC_DEBUG_MODE:-"false"}

# Perform replacements in dist/env.js
${SED_INPLACE} "s|{{__PUBLIC_APP_API_BASE__}}|$PUBLIC_APP_API_BASE|g" dist/env.js
${SED_INPLACE} "s|{{__PUBLIC_DIFY_PROXY_API_BASE__}}|$PUBLIC_DIFY_PROXY_API_BASE|g" dist/env.js
${SED_INPLACE} "s|{{__PUBLIC_DEBUG_MODE__}}|$PUBLIC_DEBUG_MODE|g" dist/env.js

echo "✅ React App 环境变量替换完成"

echo "✅ React App 构建完成，静态文件位于: packages/react-app/dist"
cd ../..

