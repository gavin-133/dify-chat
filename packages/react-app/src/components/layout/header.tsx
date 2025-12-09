import { useIsMobile } from '@dify-chat/helpers'
import { ThemeSelector, useThemeContext } from '@dify-chat/theme'
import { Space } from 'antd'
import classNames from 'classnames'
import React from 'react'

import IconNewChat from '@/assets/icons/icon_new_chat_outlined.svg'
import IconSidebar from '@/assets/icons/icon_sidebar_outlined.svg'
import { LucideIcon } from '@/components'

import CenterTitleWrapper from './center-title-wrapper'
import './header.css'
import { GithubIcon, Logo } from './logo'

export interface IHeaderLayoutProps {
	/**
	 * 自定义标题
	 */
	title?: React.ReactNode
	/**
	 * 传进来的标题是否已经包含容器
	 */
	isTitleWrapped?: boolean
	/**
	 * 自定义右侧图标
	 */
	rightIcon?: React.ReactNode
	/**
	 * Logo 文本
	 */
	logoText?: string
	/**
	 * 自定义 Logo 渲染
	 */
	renderLogo?: () => React.ReactNode
	/**
	 * 左侧菜单图标点击事件
	 */
	onMenuClick?: () => void
	/**
	 * 右侧新建对话按钮点击事件
	 */
	onNewConversation?: () => void
	/**
	 * 是否禁用新建对话按钮
	 */
	disableNewButton?: boolean
}

const HeaderSiderIcon = (props: { align: 'left' | 'right'; children: React.ReactNode }) => {
	return (
		<div
			className={classNames({
				'flex-1 h-full flex items-center': true,
				'justify-start': props.align === 'left',
				'justify-end': props.align === 'right',
			})}
		>
			{props.children}
		</div>
	)
}

const headerStyle = {
	backgroundColor: 'white',
	height: '56px',
	background: '#fff',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	padding: '0 16px',
	flexShrink: 0,
	zIndex: 100,
}

const headerStyleWithShadow = {
	...headerStyle,
	boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
}
/**
 * 头部布局组件
 */
export default function HeaderLayout(props: IHeaderLayoutProps) {
	const {
		isTitleWrapped,
		title,
		rightIcon,
		logoText,
		renderLogo,
		onMenuClick,
		onNewConversation,
		disableNewButton,
	} = props
	const { themeMode } = useThemeContext()
	const isMobile = useIsMobile()

	// 移动端布局
	if (isMobile) {
		return (
			<div
				className="h-16 flex items-center justify-between px-4"
				style={headerStyle}
			>
				{/* 左侧菜单图标 */}
				<HeaderSiderIcon align="left">
					{onMenuClick ? (
						<div
							className="flex items-center cursor-pointer mobile-icon-btn"
							onClick={onMenuClick}
						>
							<img
								src={IconSidebar}
								alt="menu"
								width={24}
								height={24}
							/>
						</div>
					) : null}
				</HeaderSiderIcon>

				{/* 中间标题 */}
				{isTitleWrapped ? title : <CenterTitleWrapper>{title}</CenterTitleWrapper>}

				{/* 右侧新建对话按钮 */}
				<HeaderSiderIcon align="right">
					{onNewConversation ? (
						<div
							className={classNames('flex items-center mobile-icon-btn', {
								'cursor-pointer': !disableNewButton,
								'cursor-not-allowed opacity-50': disableNewButton,
							})}
							onClick={() => {
								if (!disableNewButton && onNewConversation) {
									onNewConversation()
								}
							}}
						>
							<img
								src={IconNewChat}
								alt="new chat"
								width={24}
								height={24}
							/>
						</div>
					) : null}
				</HeaderSiderIcon>
			</div>
		)
	}

	// PC端保持原有布局
	return (
		<div
			className="h-16 flex items-center justify-between px-4"
			style={headerStyleWithShadow}
		>
			{/* 🌟 Logo */}
			<HeaderSiderIcon align="left">
				<Logo
					text={logoText}
					renderLogo={renderLogo}
					hideText={isMobile}
					hideGithubIcon
				/>
			</HeaderSiderIcon>

			{/* 中间标题 */}
			{isTitleWrapped ? title : <CenterTitleWrapper>{title}</CenterTitleWrapper>}

			{/* 右侧图标 */}

			<HeaderSiderIcon align="right">
				{rightIcon || (
					<Space
						className="flex items-center"
						size={16}
					>
						<ThemeSelector>
							<div className="flex items-center cursor-pointer">
								<LucideIcon
									name={
										themeMode === 'dark'
											? 'moon-star'
											: themeMode === 'light'
												? 'sun'
												: 'screen-share'
									}
									size={20}
								/>
							</div>
						</ThemeSelector>
						<GithubIcon />
					</Space>
				)}
			</HeaderSiderIcon>
		</div>
	)
}
