<template>
    <view class="container" style="background: #fbc82f;">
        <view class="lucky-wheel">
			<image src="../../static/activity/color_pillar.png" class="lucky-wheel-img" mode="aspectFit"></image>
            <view class="lucky-title">
				<image src="../../static/activity/lucky_title.png" class="lucky-title-img" mode="aspectFit"></image>
			</view>
            <view class="wheel-main">
                <view class="wheel-pointer-box">
                    <view class="wheel-pointer" @click="rotateHandle()" :style="{transform:rotateAnglePointer,transition:rotateTransitionPointer}"></view>
                </view>
                <view class="wheel-bg" :style="{transform:rotateAngle,transition:rotateTransition}">
					<image class="wheel-bg-img" src="../../static/activity/draw_wheel.png" mode="aspectFit"></image>
                    <view class="prize-list">
                        <view class="prize-item" v-for="(item,index) in prizeList" :key="index">
                            <view >
								<image class="prize-pic" :src="item.icon" mode="aspectFit"></image>
                            </view>
                            <view class="prize-count" v-if="item.count">
                                {{item.count}}
                            </view>
                            <view class="prize-type">
                                {{item.name}}
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="main">
            <view class="main-bg"></view>
            <view class="bg-p"></view>
            <view class="content">
                <p class="did">{{ did || '未识别到您的DID' }}</p>
                <view class="lotteryTicket">免费抽奖次数： {{ lotteryTicket }}</view>
            </view>
            <view class="tip">
                <view class="tip-title">活动规则</view>
                <view class="tip-content">
                    <p> 1.使用区块链头像后，即可获得一次幸运大转盘的机会</p>
                    <p> 2.中奖后的PRA会直接转入您区块链头像所包含的DID账号中</p>
                    <p> 3.如您刚更换区块链头像，需要等4个小时生效，请稍后再来尝试</p>
                </view>
            </view>
        </view>
        <view class="toast" v-show="toastControl">
            <view class="toast-container">
                <img :src="toastPictrue" class="toast-picture" mode="aspectFit">
                <view class="close" @click="closeToast()"></view>
                <view class="toast-title">
                    {{toastTitle}}
                </view>
                <view class="toast-btn">
                    <view class="toast-cancel"  @click="closeToast">关闭</view>
                </view>
            </view>
        </view>
        <view class="toast-mask" v-show="toastControl"></view>
    </view>
</template>
<script>
// import { getWechatUser, decodeAvatar, getGift, drawLottery, getLotteryRecord } from '@/util/api'
export default {
    name: 'luckyWheel',
    data() {
        return {
            easejoyBean: 0, // 金豆
            lotteryTicket: 0, // 抽奖次数
            did: '',
            prizeList: [
                {
                    icon: '../../static/activity/bean_500.png', // 奖品图片
                    count: 50, // 奖品数量
                    name: 'PRA', // 奖品名称
                    isPrize: 1 // 该奖项是否为奖品
                },
                {
                    icon: '../../static/activity/bean_one.png',
                    count: 15,
                    name: 'PRA',
                    isPrize: 1
                },
                {
                    icon: '../../static/activity/bean_five.png',
                    count: 20,
                    name: 'PRA',
                    isPrize: 1
                },
                {
                    icon: '../../static/activity/point_five.png',
                    count: 5,
                    name: 'PRA',
                    isPrize: 1
                },
                {
                    icon: '../../static/activity/point_ten.png',
                    count: 10,
                    name: 'PRA',
                    isPrize: 1
                },
                {
                    icon: '../../static/activity/bean_500.png',
                    count: 30,
                    name: 'PRA',
                    isPrize: 1
                },
                {
                    icon: '../../static/activity/give_up.png',
                    count: 0,
                    name: '未中奖',
                    isPrize: 0
                },
                {
                    icon: '../../static/activity/bean_500.png',
                    count: 40,
                    name: 'PRA',
                    isPrize: 1
                }
            ], // 奖品列表
            toastControl: false, // 抽奖结果弹出框控制器
            hasPrize: false, // 是否中奖
            startRotatingDegree: 0, // 初始旋转角度
            rotateAngle: 0, // 将要旋转的角度
            startRotatingDegreePointer: 0, // 指针初始旋转角度
            rotateAnglePointer: 0, // 指针将要旋转的度数
            rotateTransition: 'transform 6s ease-in-out', // 初始化选中的过度属性控制
            rotateTransitionPointer: 'transform 12s ease-in-out', // 初始化指针过度属性控制
            clickFlag: true, // 是否可以旋转抽奖
            index: 0
        };
    },
    mounted() {
        this.$nextTick(async() => {
            try {
				let that = this
                this.initPrizeList()
				uni.getAuthCode({
					provider: 'alipay',
					scopes: 'auth_user',
					success: function (infoRes) {
						console.log(infoRes);
						uni.getAuthUserInfo({
							provider: 'alipay',
							success: function (res) {
								let url='/api/v1/mainnet/decode_avatar'
								let param = {
									avatar:res.avatar.replace(/\d+$/, 0)
								}
								that.$api.apipost(url,param,'get')
								.then(res=>{
									const { data: { result }} = res
									that.did = result
									
									let url='/api/v1/lottery/records'
									let param = {
										did:that.did
									}
									that.$api.apipost(url,param,'get')
									.then(res=>{
										const { data: { list }} = res
										if (that.did && list.length === 0) that.lotteryTicket = 1
									})
								})
							}
						});
					}
				});
            } catch (error) {
                console.log(error)
            }
        });
    },
    computed: {
        toastTitle() {
            return this.hasPrize ?
                '恭喜您，获得' + this.prizeList[this.index].count + ' ' + this.prizeList[this.index].name :
                '未中奖'
        },
        toastPictrue() {
            return this.hasPrize ?
                require('../../static/activity/congratulation.png') :
                require('../../static/activity/sorry.png')
        }
    },
    methods: {
    // 此方法为处理奖品数据
        async initPrizeList() {
            // const { data: { list }} = await getGift();
			let url='/api/v1/lottery/gifts'
			let param = {}
			this.$api.apipost(url,param,'get')
			.then(res=>{
				const { data: { list }} = res
				this.prizeList = this.prizeList.map((v, i) => {
					let { id, name, reward } = list[i]
					name = name.replace('PRA', '').replace('未中奖', '')
					v.id = id
					v.count = name
					v.reward = reward
					return v
				})
				console.log(this.prizeList, 'prize list')
			})
			
        },
        async rotateHandle() {
            if (!this.did) return uni.showToast({
            	title:'没有检测到您的DID，无法参与抽奖',
				icon:'none'
            })
			
			let url='/api/v1/lottery/draw'
			let param = {
				did:this.did
			}
			this.$api.apipost(url,param,'get')
			.then(res=>{
				const data = res
				if (data.hasErrors) {
					uni.showToast({
					    title: data.message,
					    duration: 2000,
						icon:'none'
					});
				    // this.$toast()
				} else {
				    const { data: { id }} = data
				    this.index = id - 1 // 指定每次旋转到的奖品下标
				    this.rotating()
				}
			})
            // const data = await drawLottery(this.did)
        },
        rotating() {
            if (!this.clickFlag) return
            var type = 0 // 默认为 0  转盘转动 1 箭头和转盘都转动(暂且遗留)
            var duringTime = 5 // 默认为1s
            // var random = Math.floor(Math.random() * 7)
            var resultIndex = this.index // 最终要旋转到哪一块，对应prize_list的下标
            var resultAngle = [337.5, 292.5, 247.5, 202.5, 157.5, 112.5, 67.5, 22.5] // 最终会旋转到下标的位置所需要的度数
            var randCircle = 6 // 附加多转几圈，2-3
            this.clickFlag = false // 旋转结束前，不允许再次触发
            if (type === 0) {
                // 转动盘子
                var rotateAngle =
          this.startRotatingDegree +
          randCircle * 360 +
          resultAngle[resultIndex] -
          this.startRotatingDegree % 360;
                this.startRotatingDegree = rotateAngle;
                this.rotateAngle = 'rotate(' + rotateAngle + 'deg)';
                // // //转动指针
                // this.rotateAnglePointer = 'rotate('+this.startRotatingDegreePointer + 360*randCircle+'deg)'
                // this.startRotatingDegreePointer =360*randCircle
                var that = this
                // 旋转结束后，允许再次触发
                setTimeout(() => {
                    that.clickFlag = true
                    that.gameOver()
                }, duringTime * 1000 + 1500) // 延时，保证转盘转完
            } else {
                //
            }
        },
        gameOver() {
            this.toastControl = true
            this.hasPrize = this.prizeList[this.index].isPrize
            this.lotteryTicket = 0
        },
        closeToast() {
            this.toastControl = false
        }
    }
};
</script>
<style lang="scss" scoped>
@import '../../static/css/variables.scss';
.container {
  font-size: $baseFontSize;
  .lucky-wheel {
    width: 100%;
    height: 490px;
    // background: rgb(252, 207, 133) url("../../static/activity/color_pillar.png") no-repeat
    //   center bottom;
    background-size: 100%;
    padding-top: 30px;
	
	.lucky-wheel-img{
		width: 100%;
		height: 490px;
		position: absolute;
		z-index: -1;
	}
    .lucky-title {
      width: 100%;
      height: 130px;
      // background: url("../../static/activity/lucky_title.png") no-repeat center top;
      background-size: 100%;
    }
	.lucky-title-img{
		width: 100%;
		height: 130px;
	}
    .wheel-main {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .wheel-bg {
        width: 290px;
        height: 290px;
        // background: url("../../static/activity/draw_wheel.png") no-repeat center top;
        background-size: 100%;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        transition: transform 3s ease;
		position: relative;
		.wheel-bg-img{
			width: 290px;
			height: 290px;
			z-index: 1;
			position: absolute;

		}
		
        & > view {
          text-align: center;
        }
        .prize-list {
          width: 100%;
          height: 100%;
          position: relative;
          .prize-item {
            width: 58px;
            height: 88px;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            .prize-pic{
              width: 70px;
              height: 40px;
              margin: 10px auto 0;
            }
            &:first-child {
              top: 15px;
              left: 150px;
              transform: rotate(20deg);
            }
            &:nth-child(2) {
              top: 63px;
              left: 205px;
              transform: rotate(67deg);
            }
            &:nth-child(3) {
              top: 135px;
              left: 205px;
              transform: rotate(-250deg);
            }
            &:nth-child(4) {
              top: 186px;
              left: 156px;
              transform: rotate(-210deg);
            }
            &:nth-child(5) {
              top: 189px;
              left: 82px;
              transform: rotate(-160deg);
            }
            &:nth-child(6) {
              top: 135px;
              left: 33px;
              transform: rotate(-111deg);
            }
            &:nth-child(7) {
              top: 65px;
              left: 33px;
              transform: rotate(-69deg);
            }
            &:nth-child(8) {
              top: 15px;
              left: 82px;
              transform: rotate(-20deg);
            }
          }
        }
      }
      .wheel-pointer-box {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 100;
        transform: translate(-50%, -60%);
        width: 100px;
        height: 100px;
        .wheel-pointer {
          width: 100px;
          height: 100px;
          background: url("../../static/activity/draw_btn.png") no-repeat center top;
          background-size: 100%;
          transform-origin: center 60%;
        }
      }
    }
  }
}
.main {
  position: relative;
  width: 100%;
  background: rgb(243, 109, 86);
  padding-bottom: 54px;
  .main-bg {
    width: 100%;
    height: 210px;
    position: absolute;
    top: -59px;
    left: 0;
    background: url("../../static/activity/luck_bg.png") no-repeat center top;
    background-size: 100%;
  }
  .bg-p {
    width: 100%;
    height: 80px;
    background: rgb(252, 207, 133);
  }
  .content {
    position: absolute;
    top: 5.6px;
    left: 0;
    background: rgb(243, 109, 86);
    width: 100%;
    height: 166px;
    color: #ffeb39;
    text-align: center;
    .did {
      width: 80%;
      overflow: hidden;
      margin: 0 auto;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .tip {
    position: relative;
    margin: 20px auto 0;
    width: 300px;
    border: 0.0313rem solid #fbc27f;
    .tip-title {
      font-size: $largeFontSize;
      position: absolute;
      top: -22px;
      left: 50%;
      transform: translate(-50%, 0);
      color: #fccc6e;
      background: rgb(243, 109, 86);
      padding: 10px 20px;
    }
    .tip-content {
      padding: 30px 20px;
      color: #fff8c5;
      line-height: 1.5;
    }
  }
}
.toast-mask {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  width: 100%;
  height: 100%;
}
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 20000;
  transform: translate(-50%, -50%);
  width: 254px;
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  background-color: rgb(252, 244, 224);
  .toast-container {
    position: relative;
    width: 100%;
    height: 100%;
    border: 0.0313rem dotted #fccc6e;
  }
  .toast-picture {
    position: absolute;
    top: -88px;
    left: -18px;
    width: 300px;
  }
  .toast-title {
    padding: 40px 0;
    color: #fc7939;
    text-align: center;
  }
  .toast-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    & > view {
      background-image: -moz-linear-gradient(
        -18deg,
        rgb(242, 148, 85) 0%,
        rgb(252, 124, 88) 51%,
        rgb(252, 124, 88) 99%
      );
      background-image: -ms-linear-gradient(
        -18deg,
        rgb(242, 148, 85) 0%,
        rgb(252, 124, 88) 51%,
        rgb(252, 124, 88) 99%
      );
      background-image: -webkit-linear-gradient(
        -18deg,
        rgb(242, 148, 85) 0%,
        rgb(252, 124, 88) 51%,
        rgb(252, 124, 88) 99%
      );
      box-shadow: 0rem 0.125rem 0rem 0rem rgba(174, 34, 5, 0.7);
      width: 100px;
      height: 30px;
      border-radius: 40px;
      text-align: center;
      line-height: 30px;
      color: #fff;
    }
  }
  .close {
    position: absolute;
    top: -20px;
    right: -20px;
    width: 34px;
    height: 34px;
    background: url("../../static/activity/close_store.png") no-repeat center top;
    background-size: 100%;
  }
}
</style>