<template>
	
	<view>
		<!--
		* 广告组件
		* timedown 倒计时时间
		* imageUrl 背景图
		* url 跳转链接
		*  -->
		<!-- #ifndef MP -->
		<mix-advert 
			ref="mixAdvert" 
			:timedown="8" 
			imageUrl="/static/advert.jpg"
			:url="advertNavUrl"
		></mix-advert>
		<!-- #endif -->
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
						<swiper-item>
							<view class="swiper-item uni-bg-red">A</view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item uni-bg-green">B</view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item uni-bg-blue">C</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
			<view class="zt-business-list">
				<view class="zt-business-module" v-for="item in itemList">
					<view class="module-title">账户变更</view>
					<view class="module-content">
						<view class="module-item" v-for="item in itemList">
							<image :src="appUrl"></image>
							<text>变更电话</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import mixAdvert from '@/components/mix-advert/vue/mix-advert';
	
	export default {
		components: {
			mixAdvert
		},
		data() {
			return {
				background: ['color1', 'color2', 'color3'],
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				
				appUrl: 'https://rpa.slave.haqh.com:8088/common/images/default_head.png',
				itemList: [
					1,2,3,4,5,6,7,
				]
			}
		},
		methods: {
			
		},
		onReady(){
			/**
			 * 启动页广告 使用文档（滑稽）
			 * 1. 引入组件并注册 
			 * 2. 调用组件的initAdvert()方法进行初始化
			 * 
			 *  初始化的时机应该是在splash关闭时，否则会造成在app端广告显示了数秒后首屏才渲染出来
			 */
			// #ifndef MP
			this.$refs.mixAdvert.initAdvert();
			// #endif
		},
	}
</script>

<style>
	.swiper {
		height: 300upx;
	}
	.swiper-item {
		display: block;
		height: 300upx;
		line-height: 300upx;
		text-align: center;
	}

	.swiper-list {
		margin-top: 40upx;
		margin-bottom: 0;
	}
	
	.uni-common-mt{
		margin-top:60upx;
		position:relative;
	}
	
	.info {
		position: absolute;
		right:20upx;
	}
	.zt-business-module{
		background-color: #fffbfb;
		margin: 40upx 0;
	}
	.zt-business-module .module-title{
		color: #BBBBBB;
		padding-left: 10upx;
		border-left: 2px solid #007AFF;
	}
	.zt-business-module .module-content{
		margin-top: 10upx;
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		justify-content: start;
		border-top: 2px solid #B2B2B2;
	}
	.zt-business-module .module-content image{
		width: 132upx;
		height: 132upx;
		border-radius: 80upx;
	}
	.zt-business-module .module-content .module-item{
		display: flex;
		flex-flow: column;
		justify-content: center;
		margin: 20upx;
		font-size: 12px;
	}
	.zt-business-module .module-content text{
		text-align: center;
	}
</style>
