<template>
    <div ref="wrapper">
      <slot></slot>
    </div>
</template>

<script>
 import BScroll from 'better-scroll'

 export default {
    //  通过 props 的形式，把一些对 better-scroll 定制化的控制权交给父组件，不传值的话就是用默认值
   props:{
       /**
       * 1 滚动的时候会派发scroll事件，会截流。
       * 2 滚动的时候实时派发scroll事件，不会截流。
       * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
       */
     probeType: {
       type: Number,
       default: 1
     },
      //  点击列表是否派发世界
     click: {
       type:Boolean,
       default:true
     },
    //  列表的数据
     data: {
       type:Array,
       default:null
     },
    //  用来让scroll要不要监听滚动事件
     listenScroll: {
       type: Boolean,
       default: false
     }
   },
  //  保证在DOM渲染完毕后初始化 better-scroll
   mounted() {
     setTimeout(() => {
       this._initScroll()
     },20)
   },
   methods: {
     _initScroll() {
       if(!this.$refs.wrapper) {
         return
       }
        //  better-scroll的初始化
       this.scroll = new BScroll(this.$refs.wrapper , {
         probeType: this.probeType,
         click: this.click
       })
       //  如果有监听滚动，拿到位置，然后派发一个scroll事件出去
       if(this.listenScroll) {
          // 保存vue实例的this
         let me = this
         // pos是一个对象,它有一个x轴和y轴的属性  
         this.scroll.on('scroll', (pos) => {
           me.$emit('scroll',pos)
         })
       }
     },
    //  代理方法
    // 代理better-scroll的enable方法
     enable() {
       this.scroll && this.scroll.enable()
     },
     disable() {
       this.scroll && this.scroll.disable()
     },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    // scrollTo是接收一些参数的，我们要把这些参数传到better-scroll的scrollTo的参数中
    // call()、apply()、bind() 都是用来重定义 this 这个对象的！
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
   },
  // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
   watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
   }
 }
</script>

<style lang='stylus' rel="stylesheet/stylus">

</style>