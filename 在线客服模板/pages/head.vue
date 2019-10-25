<template>
	<view>
		
	</view>
</template>

<script>
	import browser from '../libs/browser.js'
	var options = {
	    'data': '123' // 自定义参数
	}
	browser.init(options)
	browser.show('http://www.baidu.com')
</script>