1. 两个行内块左右之间有空隙（display: inline-block）
2. margin上下重叠的问题
3. margin-top、margin-bottom传递给父元素问题
   1. 给父元素添加overflow: auto 触发BFC
   2. 给父元素添加 border: 1px solid transparent
   3. 给父元素设置padding-top、padding-bottom



行内非替换元素的注意事项

padding：上下会被撑起来，但不占据空间

border： 上下会被撑起来，但不占据空间

margin：上下margin不生效

width、height不生效