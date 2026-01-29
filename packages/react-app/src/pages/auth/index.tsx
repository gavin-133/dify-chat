import { LocalStorageKeys, LocalStorageStore } from '@dify-chat/helpers'
import { useMount } from 'ahooks'
import { Spin } from 'antd'

import { Logo } from '@/components'
import { config } from '@/config/runtime-config'
import { useAuth } from '@/hooks/use-auth'
import { useRedirect2Index } from '@/hooks/use-jump'
import { useGlobalStore } from '@/store'

export default function AuthPage() {
	const { userId } = useAuth()
	const redirect2Index = useRedirect2Index()
	// 从全局 store 中读取通过 isKeepAll=true 保留下来的参数，例如 apps?authStr=xxx&isKeepAll=true
	const globalParams = useGlobalStore(state => state.globalParams)

	/**
	 * 登录函数
	 */
	const handleLogin = async () => {
		// 示例 1：直接从当前 URL 上获取 authStr（例如: /auth?authStr=xxx）
		const searchParams = new URLSearchParams(window.location.search)
		const authStrFromUrl = searchParams.get('authStr')

		// 示例 2：从全局 store 中获取在 apps?authStr=xxx&isKeepAll=true 时保留下来的参数
		// LayoutIndex 会在首屏将除 isKeepAll 以外的所有 query 参数写入 globalParams
		const authStrFromStore = globalParams.authStr

		// 打印两个来源，方便你在浏览器控制台验证实际取值情况
		console.log('Auth String from URL query:', authStrFromUrl)
		console.log('Auth String from global store:', authStrFromStore)

		// 真实业务中，你可以根据需要选择优先使用哪一个值
		const authStr = authStrFromStore || authStrFromUrl
		if (!authStr) {
			console.error('未找到 authStr 参数')
			return
		}

		// 调用授权中心解密接口，获取 userId
		const authCenterUrl = config.PUBLIC_AUTH_CENTER_URL || 'http://localhost:5301'
		try {
			const resp = await fetch(`${authCenterUrl}/decrypt?base64=1`, {
				method: 'POST',
				headers: {
					'Content-Type': 'text/plain;charset=UTF-8',
				},
				// 后端要求“请求内容直接放在 body 里”，这里直接传原始 authStr 文本
				body: authStr,
			})

			if (!resp.ok) {
				throw new Error(`授权失败: ${resp.status} ${resp.statusText}`)
			}

			const data = await resp.json()

			console.log('授权响应:============', data)


			if (!data.userId) {
				throw new Error('授权响应中缺少 userId')
			}

			LocalStorageStore.set(LocalStorageKeys.USER_ID, data.userId)
			if (data.auth) {
				LocalStorageStore.set(LocalStorageKeys.AUTH, data.auth)
			}
			redirect2Index()
		} catch (error) {
			console.error('调用授权中心失败:', error)
		}
	}

	useMount(() => {
		if (!userId) {
			// 模拟自动登录
			handleLogin()
		} else {
			redirect2Index()
		}
	})

	return (
		<div className="w-screen h-screen flex flex-col items-center justify-center bg-theme-bg">
			<div className="absolute flex-col w-full h-full left-0 top-0 z-50 flex items-center justify-center">
				<Logo hideGithubIcon />
				<div className="text-theme-text">授权登录中...</div>
				<div className="mt-6">
					<Spin spinning />
				</div>
			</div>
		</div>
	)
}
