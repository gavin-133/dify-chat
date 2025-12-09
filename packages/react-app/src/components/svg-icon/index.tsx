import React from 'react'

export interface ISvgIconProps {
	/**
	 * SVG 图标路径
	 */
	src: string
	/**
	 * 图标宽度
	 */
	width?: number
	/**
	 * 图标高度
	 */
	height?: number
	/**
	 * 自定义类名
	 */
	className?: string
	/**
	 * alt 文本
	 */
	alt?: string
	/**
	 * 点击事件
	 */
	onClick?: React.MouseEventHandler<HTMLImageElement>
}

/**
 * SVG 图标组件
 * 用于渲染自定义 SVG 图标
 */
export default function SvgIcon(props: ISvgIconProps) {
	const { src, width = 16, height = 16, className, alt = 'icon', onClick } = props

	return (
		<img
			src={src}
			alt={alt}
			width={width}
			height={height}
			className={className}
			onClick={onClick}
			style={{ display: 'inline-block', verticalAlign: 'middle' }}
		/>
	)
}
