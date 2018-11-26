<template>
  <div id="game1" class="game">
    <div class="fluid container">
      <div class="page-header">
        <h1>Game 1 - Let there be coins!</h1>
        <p>Your goal is to play Satoshi Dice and then pay the rent without letting the landlord know you have just played. In your wallet you have coins that the landlord can track to last month's payment.</p>
        <button type="button" class="btn btn-outline-warning" v-on:click="doRestart">
          <small class="fas fa-undo"></small> Restart
        </button>
      </div>
      <hr>
      <div class="row">
        <div class="col-md-3">
          <div class="card">
            <div class="card-header">
              <i class="fas fa-wallet"></i> Your Wallet
              <span id="wallet-help" class="help fas fa-info-circle float-right mt-1"></span>
              <span class="fas fa-coins badge badge-success float-right mt-1 mr-1"> {{ walletValue }}</span>
              
              <b-popover target="wallet-help" triggers="hover focus" title="This is your wallet">
                <p>You wallet contains the coins you control. You can drag them to other wallets or select them and make actions.</p>
                <p>Each coin can have markers. A marker represents tracking information that the landlord will be able to track. You don't want to pay with coins having the <span class="badge badge-danger">dice</span> marker.</p>
              </b-popover>
            </div>
            <div class="card-body">
              <button type="button" class="btn btn-primary btn-sm mr-1" 
                      v-bind:disabled="isSplitDisabled"
                      v-on:click="doSplit">Split</button>
              <button type="button" class="btn btn-primary btn-sm mr-1"
                      v-bind:disabled="isJoinDisabled"
                      v-on:click="doJoin">Join</button>
              <button type="button" class="btn btn-danger btn-sm float-right" 
                      v-bind:disabled="isDiceDisabled"
                      v-on:click="playDice">(<small class="fas fa-coins"></small> 5) Dice</button>
              <hr>
              <draggable element="span" v-model="wallet.coins" :move="onMove" :options="dragOptions">
                <transition-group name="no" class="list-group" tag="ul">
                  <li :class="'list-group-item' + (element.selected ? ' selected' : '')" 
                      v-for="element in wallet.coins"
                      :key="element.id">
                    <i :class="'selector mr-1 float-left far ' + (element.selected ? 'fa-check-square' : 'fa-square')"
                       @click="element.selected = !element.selected"></i>
                    <span class="badge badge-pill badge-light float-left mr-1 mb-2">
                      <i class="fa fa-coins"></i> {{element.value}}
                    </span>
                    <span v-for="tag in element.tags" 
                          :class="'float-left mr-1 mb-1 badge badge-' + tag.type"
                          :key="tag.name"
                          :style="'opacity: ' + (tag.p < 10 ? 0 : (tag.p/100).toFixed(1))">{{tag.name}}</span>
                  </li>
                </transition-group>
              </draggable>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card" v-show="landlord.show">
            <div class="card-header">
              <i class="fas fa-wallet"></i> Landlord
              <span id="landlord-help" class="help fas fa-info-circle float-right mt-1"></span>
              <span :class="'fas fa-coins float-right mt-1 mr-1 badge ' + (landlordValue >= 0 ? 'badge-success' : 'badge-danger')"> {{ landlordValue }}</span>
              
              <b-popover target="landlord-help" triggers="hover focus" title="The landloard wallet">
                <p>The landlord expects the rent to be paid to this wallet.</p>
                <p>You cannot pay with coins having the <span class="badge badge-danger">dice</span> marker.</p>
              </b-popover>
            </div>
            <div class="card-body">
              <button type="button" id="payment-button" class="btn btn-primary btn-block btn-sm" 
                      v-bind:disabled="isPaymentDisabled"
                      v-on:click="makePayment">
                Make Payment
              </button>
              <b-popover ref="popdice" target="payment-button" triggers="blur">
                <template slot="title"><i class="fas fa-dice"></i> Busted</template>
                <p>One of the coins you're using for payment can be tracked to a Satoshi Dice play.</p>
                <p>You must ensure no coin has the <span class="badge badge-danger">dice</span> marker before paying.</p>
              </b-popover>
              <b-popover ref="popdone" target="payment-button" triggers="blur">
                <template slot="title"><i class="far fa-thumbs-up"></i> Success</template>
                <p><strong>Well done!</strong> You get to sleep indoors one more month.</p>
                <p>Most wallets just show a balance but you're actually splitting and joining coins. Just by knowing that, and that each coin can be tracked individually, you can improve your privacy.</p>
                <button type="button" id="spayment-button" class="btn btn-success btn-block"
                      v-on:click="scrollToNextGame()">
                  Next Challenge
                </button>
              </b-popover>
              <hr>
              <draggable element="span" v-model="landlord.coins" :move="onMove" :options="dragOptions">
                <transition-group name="no" class="list-group" tag="ul">
                  <li :class="'list-group-item' + (element.selected ? ' selected' : '')" 
                      v-for="element in landlord.coins"
                      :key="element.id">
                    <i :class="'selector mr-1 float-left far ' + (element.selected ? 'fa-check-square' : 'fa-square')"
                       @click="element.selected = !element.selected"></i>
                    <span class="badge badge-pill badge-light float-left mr-1 mb-2">
                      <i class="fa fa-coins"></i> {{element.value}}
                    </span>
                    <span v-for="tag in element.tags" 
                          :class="'float-left mr-1 mb-1 badge badge-' + tag.type"
                          :key="tag.name">{{tag.name}}</span>
                  </li>
                </transition-group>
              </draggable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";

const MIN_P = 5;

var coinId = 1;

function coin(value, tags) {
    return { 
      id: coinId++,
      value: value, 
      tags: tags || [],
      selected: false
    }
}

function tag(name, type, p) {
    return { name: name, type: type, p: p };
}

export default {
  name: "game",
  components: {
    draggable
  },
  data() {
    return {
      wallet: {
        initialValue: 0,
        coins: [ 
          coin(2000, [
            tag('rent', 'secondary', 100)
          ])
        ]
      },
      landlord: {
        initialValue: -500,
        show: false,
        coins: []
      },
      isDragging: false,
      delayedDragging: false
    };
  },
  ready() {
    this.initialData = this.$data;
  },
  methods: {
    doRestart() {
        Object.assign(this.$data, this.$options.data.call(this));
    },
    playDice() {
      this.landlord.show = true;
      this.doJoin();
      var coins = this.wallet.coins;
      var last = coins[coins.length - 1];
      
      // remove dice cost
      last.value -= 5;
      
      // add dice tag
      var diceTag = last.tags.find(t => t.name === 'dice');
      if (diceTag) {
        diceTag.p = 100;
      } else {
        last.tags.push(tag('dice', 'danger', 100));
      }
      
      coins.push(coin(10, [
        tag('dice', 'danger', 100)
      ]));
    },
    doSplit() {
      var keep = this.wallet.coins.filter(c => !c.selected);
      var split = this.wallet.coins.filter(c => c.selected);
      this.wallet.coins = keep.concat(split.flatMap(c => {
        var tagsClone1 = JSON.parse(JSON.stringify(c.tags));
        var tagsClone2 = JSON.parse(JSON.stringify(c.tags));
        return [
            coin(Math.floor(c.value/2), tagsClone1),
            coin(c.value - Math.floor(c.value/2), tagsClone2)
        ];
      }));
    },
    doJoin() {
      var keep = this.wallet.coins.filter(c => !c.selected);
      var join = this.wallet.coins.filter(c => c.selected);
      
      if (join.length == 0) {
        return;
      }
      
      var joinValue = join.reduce((acc, c) => acc + c.value, 0);
      var joinTags = join.reduce((acc, c) => {
        c.tags.forEach(tag => {
          let accTag = acc[tag.name];
          if (accTag) {
            accTag.p = Math.max(accTag.p, tag.p);
          } else {
            acc[tag.name] = tag;
          }          
        });
        
        return acc;
      }, {});
      
      keep.push(coin(joinValue, Object.values(joinTags)));
      this.wallet.coins = keep;
    },
    makePayment() {
        var coins = this.landlord.coins;
        var hasDice = coins
                .flatMap(c => c.tags)
                .filter(t => t.name == "dice" && t.p >= MIN_P)
                .length > 0;
        
        if (hasDice) {
            this.$refs.popdice.$emit('open');
        } else {
            this.$refs.popdone.$emit('open');
        }
    },
    scrollToNextGame() {
      // nothing
    },
    onMove({ relatedContext, draggedContext }) {
      return true;
    }
  },
  computed: {
    walletValue() {
        var sum = this.wallet.coins.reduce((acc, c) => acc + c.value, 0);
        return sum + this.wallet.initialValue;
    },
    landlordValue() {
        var sum = this.landlord.coins.reduce((acc, c) => acc + c.value, 0);
        return sum + this.landlord.initialValue;
    },
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },
    isSplitDisabled() {
      return this.wallet.coins.filter(c => c.selected).length == 0;
    },
    isJoinDisabled() {
      return this.wallet.coins.filter(c => c.selected).length < 2;
    },
    isDiceDisabled() {
      return this.wallet.coins.length == 0;
    },
    isPaymentDisabled() {
      return this.landlordValue < 0;
    }
  },
  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    }
  }
};
</script>
