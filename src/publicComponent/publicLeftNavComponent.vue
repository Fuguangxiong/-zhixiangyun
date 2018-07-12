<template>
  <div class="publicLeftTotalContainer">
    <div class="publicLeftContainer">
      <div class="publicLeftTopContainer" v-on:click="gotoAppMarket"></div>
      <div class="publicLeftNavScaleBtn" v-on:click="scaleClickHandler">
        <div class="publicLeftNavScaleIcon"></div>
      </div>
      <div class="publicLeftBottomContainer">
        <div class="publicLayoutLeftBigContainer">
          <div class="publicLayoutLeftContainer">
            <div v-for="(item,index) in navArr" :key="index" class="publicLayoutLeftNavItem" :title="item.name" v-bind:class="{select:item.active}" v-on:click="navClickHandler(item, index)">
              <i class="publicLeftNavImage" v-bind:class="item.imageClass"></i>
              <span>{{item.name}}</span>
              <span class="publicLayoutLeftNavTriangle"></span>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="publicLeftChildrenContainer" :class="{childrenHide:childrenHide}">
      <!--<div class="publicLeftChildrenHeader"></div>-->
      <div class="publicLeftChildrenTitle">{{childrenTitle}}</div>
      <div class="publicLeftChildrenItemContainer">
        <div v-for="(val,index2) in childrenArr" :key="index2" :class="{active:val.active}" class="publicLeftChildrenItem" v-on:click="childNavClickHandler(val)">{{val.name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
    import $ from 'jquery'
    import publicPath from '../publicJs/publicPathConfig'
    import util from '../publicJs/UtilService'
    export default{
      data: function () {
        return {
          navArr: this.navData,
          childrenArr: [],
          hasClass: false,
          childrenHide: false,
          childrenTitle: '',
          navIndex: 0
        }
      },

      props: {
        navData: {},
        special: {},
        change:{}
      },
      watch: {
        navData (val, oldVal) {
          this.navArr = val
          var bodyClass = sessionStorage.getItem('bodyClass')
          if (bodyClass == null || bodyClass == undefined || bodyClass == 'false' || bodyClass == false) {
            $('body').removeClass('bigSreen bigSreen2')
            window.iscEvent.emit('menuchange', 'dd')
            this.hasClass = false
          } else {
            window.iscEvent.emit('menuchange', 'dd')
            $('body').addClass('bigSreen')
            this.hasClass = true
          }
          for (let i = 0; i < this.navArr.length; i++) {
            var obj = this.navArr[i]
            if (obj.active == true && obj.children != undefined && obj.children.length > 0) {
              this.childrenTitle = obj.name
              this.childrenArr = obj.children
              $('body').addClass('bigSreen')
              $('body').addClass('bigSreen2')
              window.iscEvent.emit('menuchange', 'dd')
              this.hasClass = true
            }
          }
        },
        change(val,oldVal){
          this.navArr = this.navData;
          var bodyClass = sessionStorage.getItem('bodyClass')
        // console.info("bodyClass=",bodyClass);
        
          if (bodyClass == null || bodyClass == undefined || bodyClass == 'false' || bodyClass == false) {
            //$('body').removeClass('bigSreen')
            $('body').removeClass('bigSreen bigSreen2')
            window.iscEvent.emit('menuchange', 'dd')
            this.hasClass = false
          } else {
            window.iscEvent.emit('menuchange', 'dd')
            $('body').addClass('bigSreen')
            this.hasClass = true
          }
          for (let i = 0; i < this.navArr.length; i++) {
            var obj = this.navArr[i]
            if (obj.active == true && obj.children != undefined && obj.children.length > 0) {
              this.childrenTitle = obj.name
              this.childrenArr = obj.children
              $('body').addClass('bigSreen')
              $('body').addClass('bigSreen2')
              window.iscEvent.emit('menuchange', 'dd')
              this.hasClass = true
            }
          }
        }
      },

      created () {
        console.info('navArr=', this.navArr)
        window.iscEvent = util.custormEvent()
        window.iscEvent.on('menuchange', function () {
        })
        var bodyClass = sessionStorage.getItem('bodyClass')
        // console.info("bodyClass=",bodyClass);
        if (bodyClass == null || bodyClass == undefined || bodyClass == 'false' || bodyClass == false) {
          $('body').removeClass('bigSreen');
          //$('body').removeClass('bigSreen bigSreen2')
          this.hasClass = false
        } else {
          $('body').addClass('bigSreen')
          this.hasClass = true
        }
        for (let i = 0; i < this.navArr.length; i++) {
          var obj = this.navArr[i]
          if (obj.active == true && obj.children != undefined && obj.children.length > 0) {
            this.childrenTitle = obj.name
            this.childrenArr = obj.children
            $('body').addClass('bigSreen')
            $('body').addClass('bigSreen2')
            this.hasClass = true
          }
        }
      },
      methods: {
          initMenu(){

          },
        navClickHandler (item, index) {
          var that = this
          this.navIndex = index
          for (var i = 0; i < that.navArr.length; i++) {
            var obj = that.navArr[i]
            if (obj.active == true) {
              obj.active = false
              break
            }
          }
          item.active = true
          if (item.children != undefined && item.children != null && item.children.length > 0) {
            // console.info('fdfdfdf=', item.children)
            that.childNavClickHandler(item.children[0])
            if ($('body').hasClass('bigSreen2')) {
              if (item.name != that.childrenTitle) {
                that.childrenHide = true
                setTimeout(function () {
                  that.childrenTitle = item.name
                  that.childrenArr = item.children
                  that.childrenHide = false
                }, 400)
              }
            } else {
              that.childrenTitle = item.name
              that.childrenArr = item.children
              $('body').addClass('bigSreen bigSreen2')
              window.iscEvent.emit('menuchange', 'dd')
              that.hasClass = true
            }
          } else {
            this.$emit('linkchange', item)
            if ($('body').hasClass('bigSreen2')) {
              $('body').removeClass('bigSreen bigSreen2')
              window.iscEvent.emit('menuchange', 'dd')
              that.hasClass = false
            }
          }
        },
        childNavClickHandler (item) {
        //   console.info('fdkfjfd=', item)
          // console.info('CHILD', this.navArr[this.navIndex])
          if (!this.navArr[this.navIndex].children) return
          for (var i = 0; i < this.navArr[this.navIndex].children.length; i++) {
            var obj = this.navArr[this.navIndex].children[i]
            if (obj.active == true) {
              obj.active = false
              break
            }
          }
          item.active = true
          this.$emit('linkchange', item)
        },
        scaleClickHandler () {
          var that = this
          that.hasClass = !that.hasClass
          if (that.hasClass) {
            $('body').addClass('bigSreen')
          } else {
            $('body').removeClass('bigSreen bigSreen2')
          }
          window.iscEvent.emit('menuchange', 'dd')
          sessionStorage.setItem('bodyClass', that.hasClass)
        },
        gotoAppMarket () {
          console.info('dfdfdfdf', this.special)
      // window.location.href = publicPath.APP_MARKET
          if (!this.special) {
            window.location.href = publicPath.APP_MARKET
          } else {
            this.$emit('special', 'gotoHome')
          }
        }

      }
    }
</script>
<style scoped>
.active {
  background-color: #fff;
}
</style>

