<template>
  <div :id="id" class="game">
    <div class="fluid container">
      <div class="page-header">
        <h1><slot name="title">Game Title</slot></h1>
        <slot name="goal">
          <p>Your goal is to play Satoshi Dice and then pay the rent without letting the landlord know you have played dice or made any other known gambling. In your wallet you have coins that the landlord can track to last month's payment.</p>
        </slot>
        <button :id="id + 'restartbutton'" type="button" class="btn btn-outline-warning"
                v-on:click="doRestart">
          <small class="fas fa-undo"></small> Restart
        </button>
        <b-popover :show="showhelp" ref="poph1" :target="id + 'restartbutton'" triggers="blur" placement="right">
          <i class="far fa-lightbulb"></i> You can use this button to reset the game. 
          <button type="button" class="btn btn-link btn-sm" @click="closePopover('poph1')">Ok</button>
        </b-popover>
      </div>
      <hr>
      <div class="row">
        <div class="col-md-3">
          <div class="card">
            <div class="card-header">
              <i class="fas fa-wallet"></i> Your Wallet
              <span :id="id + '-wallet-help'" class="help fas fa-info-circle float-right mt-1"></span>
              <span class="fas fa-coins badge badge-success float-right mt-1 mr-1"> {{ walletValue }}</span>
              
              <b-popover :target="id + '-wallet-help'"
                         triggers="hover blur"
                         title="This is your wallet">
                <p>You wallet contains the coins you control. You can drag them to other wallets or select them and make actions.</p>
                <p>Each coin can have markers. A marker represents tracking information that the landlord will be able to use. You don't want to pay with coins having the <span class="badge badge-danger">dice</span> marker.</p>
              </b-popover>
            </div>
            <div class="card-body">
              <button type="button" class="btn btn-primary btn-sm mr-1" 
                      v-bind:disabled="isSplitDisabled"
                      v-on:click="doSplit">Split</button>
              <button type="button" class="btn btn-primary btn-sm mr-1"
                      v-bind:disabled="isJoinDisabled"
                      v-on:click="doJoin">Join</button>
              <button :id="id + 'wdicebutton'" type="button" class="btn btn-danger btn-sm float-right" 
                      v-bind:disabled="isDiceDisabled"
                      v-on:click="playDice">(<small class="fas fa-coins"></small> 5) Dice</button>
              <b-popover :show="showhelp" ref="poph2" :target="id + 'wdicebutton'" 
                         triggers="blur" placement="right">
                <i class="far fa-lightbulb"></i> These are the actions you can perform on the wallet. 
                <button type="button" class="btn btn-link btn-sm" 
                        @click="closePopover('poph2')">Ok</button>
              </b-popover>
              <hr>
              
              <draggable element="span" v-model="wallet.coins" :move="onMove" :options="dragOptions">
                <transition-group name="no" class="list-group" tag="ul">
                  <li :id="id + 'wc' + element.id" :class="'list-group-item' + (element.selected ? ' selected' : '')" 
                      :key="element.id"
                      v-for="element in wallet.coins">
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
              
              <b-popover :show="showhelp" ref="poph3" :target="id + 'wc1'" triggers="blur" placement="right">
                <i class="far fa-lightbulb"></i> You can drag each coin to a new wallet, when available.
                <button type="button" class="btn btn-link btn-sm"
                        @click="closePopover('poph3')">Ok</button>
              </b-popover>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card" v-show="landlord.show">
            <div class="card-header">
              <i class="fas fa-wallet"></i> Landlord
              <span :id="id + '-landlord-help'" class="help fas fa-info-circle float-right mt-1"></span>
              <span :class="'fas fa-coins float-right mt-1 mr-1 badge ' + (landlordValue >= 0 ? 'badge-success' : 'badge-danger')"> {{ landlordValue }}</span>
              
              <b-popover :target="id + '-landlord-help'" 
                         triggers="hover focus"
                         title="The landlord's wallet">
                <p>The landlord expects the rent to be paid to this wallet.</p>
                <p>You cannot pay with coins having the <span class="badge badge-danger">dice</span> marker.</p>
              </b-popover>
            </div>
            <div class="card-body">
              <button type="button" :id="id + '-payment-button'"
                      class="btn btn-primary btn-block btn-sm" 
                      v-bind:disabled="isPaymentDisabled"
                      v-on:click="makePayment">
                Make Payment
              </button>
              <b-popover :show.sync="popdiceShow" :target="id + '-payment-button'" triggers="blur">
                <template slot="title"><i class="fas fa-dice"></i> Busted</template>
                <p>One of the coins you're using for payment can be tracked to a Satoshi Dice play.</p>
                <p>You must ensure no coin has the <span class="badge badge-danger">dice</span> or any other gambling marker before paying.</p>
              </b-popover>
              <b-popover :show.sync="popdoneShow" :target="id + '-payment-button'" triggers="blur">
                <template slot="title"><i class="far fa-thumbs-up"></i> Success</template>
                <p><strong>Well done!</strong> You get to sleep indoors one more month.</p>
                <slot name="finalMessage">Final Message</slot>
                <button v-show="next" type="button" id="spayment-button" class="btn btn-success btn-block"
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
                          :key="tag.name"
                          :style="'opacity: ' + (tag.p < 10 ? 0 : (tag.p/100).toFixed(1))">{{tag.name}}</span>
                  </li>
                </transition-group>
              </draggable>
            </div>
          </div>
        </div>
        <div class="col-md-3" v-if="showmixer">
          <div class="card">
            <div class="card-header">
              <i class="fas fa-wallet"></i> Mixer
              <span :id="id + '-mixer-help'" class="help fas fa-info-circle float-right mt-1"></span>
              <span :class="'fas fa-coins float-right mt-1 mr-1 badge ' + (mixerValue >= 5 ? (mixerValue >= 30 ? 'badge-success' : 'badge-warning') : 'badge-danger')"> {{ mixerValue }}</span>
              
              <b-popover :target="id + '-mixer-help'" 
                         :show="showmixerhelp"
                         triggers="hover focus"
                         title="The mixer's wallet">
                <p>A mixer can take your coins an give you new ones with a different history.</p>
                <p>You need to trust the mixer. If it's a good mixer, the new coins will be clean. If it's a bad mixer then some of the coins you get may be tracked to other gambling activities.</p>
              </b-popover>
            </div>
            <div class="card-body">
              <button :id="id + 'mixergoodbutton'" type="button" class="btn btn-success btn-sm mr-1"
                      v-bind:disabled="isGoodMixDisabled"
                      v-on:click="doTrustedMix">(<small class="fas fa-coins"></small> 30) Mix</button>
              <button :id="id + 'mixerbadbutton'" type="button" class="btn btn-warning btn-sm mr-1"
                      v-bind:disabled="isBadMixDisabled"
                      v-on:click="doUntrustedMix">(<small class="fas fa-coins"></small> 5) Mix</button>
              <b-popover :show="showmixerhelp" ref="poph5" :target="id + 'mixergoodbutton'" 
                         triggers="blur" placement="left">
                <i class="far fa-lightbulb"></i> You can use a trusted mixer for <small class="fas fa-coins"></small> 30 or a mixer with a 60% chance of giving you bad coins for <small class="fas fa-coins"></small> 5. 
                <button type="button" class="btn btn-link btn-sm" 
                        @click="closePopover('poph5')">Ok</button>
              </b-popover>
              <hr>
              <draggable element="span" v-model="mixer.coins" :move="onMove" :options="dragOptions">
                <transition-group name="no" class="list-group" tag="ul">
                  <li :class="'list-group-item' + (element.selected ? ' selected' : '')" 
                      v-for="element in mixer.coins"
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
        <div class="col-md-3" v-show="showshuffle">
          <div class="card">
            <div class="card-header">
              <img height="12" src="../assets/logo.png"> Cash Shuffle
              <span :id="id + '-shuffle-help'" class="help fas fa-info-circle float-right mt-1"></span>
              <span :class="'fas fa-coins float-right mt-1 mr-1 badge ' + (shuffleValue > 0 ?  'badge-success': 'badge-danger')"> {{ shuffleValue }}</span>
              
              <b-popover :target="id + '-shuffle-help'" 
                         :show="showshufflehelp"
                         triggers="hover focus"
                         title="The Shuffle">
                <p>Cash Shuffle allows people to mix coins together without needing to know or trust each other.</p>
                <p>It works because each person participating in the shuffle gets a coin with the same value and, from the outside, it's not possible to know which coin came from which person.</p>
              </b-popover>
            </div>
            <div class="card-body">
              <button :id="id + 'shuffle3button'" type="button" class="btn btn-success btn-sm mr-1"
                      v-bind:disabled="isShuffle3Disabled"
                      v-on:click="doShuffle3">(<small class="fas fa-coins"></small> 1) <i class="far fa-user"></i> x 3</button>
              <button :id="id + 'shuffle5button'" type="button" class="btn btn-success btn-sm mr-1"
                      v-bind:disabled="isShuffle5Disabled"
                      v-on:click="doShuffle5">(<small class="fas fa-coins"></small> 2) <i class="far fa-user"></i> x 5</button>
              <b-popover :show="showshufflehelp" ref="poph6" :target="id + 'shuffle3button'" 
                         triggers="blur" placement="left">
                <i class="far fa-lightbulb"></i> You can do a shuffle between 3 people or 5 people. More means better privacy with a slightly higher fee.
                <button type="button" class="btn btn-link btn-sm" 
                        @click="closePopover('poph6')">Ok</button>
              </b-popover>
              <hr>
              <draggable element="span" v-model="shuffle.coins" :move="onMove" :options="dragOptions">
                <transition-group name="no" class="list-group" tag="ul">
                  <li :class="'list-group-item' + (element.selected ? ' selected' : '')" 
                      v-for="element in shuffle.coins"
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

function makeCoins(propCoins) {
  return propCoins.map(pc => coin(pc.value, [ 
    tag(pc.tag, pc.tag == 'dice' ? 'danger' : 'secondary', 100) 
  ]));
}

export default {
  name: "game",
  props: {
    id: String,
    next: String,
    showhelp: Boolean,
    showmixer: Boolean,
    showmixerhelp: Boolean,
    showshuffle: Boolean,
    showshufflehelp: Boolean,
    coins: Array
  },
  components: {
    draggable
  },
  data() {
    return {
      wallet: {
        initialValue: 0,
        coins: makeCoins(this.coins)
      },
      landlord: {
        initialValue: -500,
        show: false,
        coins: []
      },
      mixer: {
        initialValue: 0,
        coins: []
      },
      shuffle: {
        initialValue: 0,
        coins: []
      },
      isDragging: false,
      delayedDragging: false,
      hasHiddenWalletpop: false,
      popdiceShow: false,
      popdoneShow: false
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
      var diceCoin;
      for (var i = coins.length - 1; i >= 0; i--) {
        if (coins[i].value >= 5) {
            diceCoin = coins[i];
            break;
        }
      }
      
      if (!diceCoin) {
        return;
      }
      
      // remove dice cost
      diceCoin.value -= 5;
      
      // add dice tag
      var diceTag = diceCoin.tags.find(t => t.name === 'dice');
      if (diceTag) {
        diceTag.p = 100;
      } else {
        diceCoin.tags.push(tag('dice', 'danger', 100));
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
              .filter(t => t.type == "danger" && t.p >= MIN_P)
              .length > 0;
      
      if (hasDice) {
          this.popdiceShow = true;
      } else {
          this.popdoneShow = true;
      }
    },
    scrollToNextGame() {
      var nextId = "#" + this.next;
      var game = this.$el.parentNode.querySelector(nextId);
      scrollTo(0, game.offsetTop);
      location.hash = nextId;
    },
    onMove({ relatedContext, draggedContext }) {
      return true;
    },
    closePopover(ref) {
      this.$refs[ref].$emit('close')
    },
    doMix(cost, mixTag) {
      var unselected = this.mixer.coins.filter(c => !c.selected);
      var mix = this.mixer.coins.filter(c => c.selected);
      
      if (mix.length == 0) {
        return;
      }
      
      var mixValue = mix.reduce((acc, c) => acc + c.value, 0) - cost;
      if (mixValue > 0) {
        var mixedCoin = coin(mixValue, mixTag ? [ tag(mixTag, 'danger', 100) ] : []);
        this.wallet.coins.push(mixedCoin);
      }
      
      this.mixer.coins = unselected;
    },
    doTrustedMix() {
      this.doMix(30);
    },
    doUntrustedMix() {
      var tag = undefined;
      if (Math.random() < (2/3)) {
         tag = ['casino', 'poker', 'tracks'][Math.floor(Math.random() * 3)]
      }
      this.doMix(5, tag);
    },
    doShuffle(cost, factor) {
      var unselected = this.shuffle.coins.filter(c => !c.selected);
      var shuffle = this.shuffle.coins.filter(c => c.selected);
      
      if (shuffle.length == 0) {
        shuffle = unselected;
        unselected = [];
      }
      
      var shuffleCoin = shuffle[0];
      var coinValue = shuffleCoin.value - cost;
      
      var finalValue;
      if (coinValue >= 100) {
        finalValue = 100 * Math.floor(coinValue / 100);
      } else if (coinValue >= 10) {
        finalValue = 10 * Math.floor(coinValue / 10);
      } else {
        finalValue = 1;
      }
      
      var changeValue = coinValue - finalValue;
      var changeTags = JSON.parse(JSON.stringify(shuffleCoin.tags));
      var finalTags = JSON.parse(JSON.stringify(shuffleCoin.tags));
      finalTags.forEach(t => {
        t.p = Math.floor(t.p / factor);
      });
      finalTags = finalTags.filter(t => t.p > MIN_P);
      
      if (changeValue > 0) {
        this.wallet.coins.push(coin(changeValue, changeTags));
      }
      
      this.wallet.coins.push(coin(finalValue, finalTags));
      this.shuffle.coins = unselected;
    },
    doShuffle3() {
      this.doShuffle(1, 3);
    },
    doShuffle5() {
      this.doShuffle(2, 5);
    },
    isShuffleDisabled(cost) {
      var selected = this.shuffle.coins.filter(c => c.selected);
      if (selected.length == 0) {
        selected = this.shuffle.coins;
      }
      var amount = selected.reduce((acc, c) => acc + c.value, 0);
      return amount <= cost;
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
    mixerValue() {
      var sum = this.mixer.coins.reduce((acc, c) => acc + c.value, 0);
      return sum + this.mixer.initialValue;
    },
    shuffleValue() {
      var sum = this.shuffle.coins.reduce((acc, c) => acc + c.value, 0);
      return sum + this.shuffle.initialValue;
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
      var selected = this.wallet.coins.filter(c => c.selected);
      var amount = selected.reduce((acc, c) => acc + c.value, 0);
      return selected.length == 0 || (selected.length > 0 && amount < 2);
    },
    isJoinDisabled() {
      return this.wallet.coins.filter(c => c.selected).length < 2;
    },
    isDiceDisabled() {
      var selected = this.wallet.coins.filter(c => c.selected);
      var amount = selected.reduce((acc, c) => acc + c.value, 0);
      return this.wallet.coins.length == 0 || (selected.length > 0 && amount < 5);
    },
    isPaymentDisabled() {
      return this.landlordValue < 0;
    },
    isGoodMixDisabled() {
      var selected = this.mixer.coins.filter(c => c.selected);
      var amount = selected.reduce((acc, c) => acc + c.value, 0);
      return amount < 30;
    },
    isBadMixDisabled() {
      var selected = this.mixer.coins.filter(c => c.selected);
      var amount = selected.reduce((acc, c) => acc + c.value, 0);
      return amount < 5;
    },
    isShuffle3Disabled() {
      return this.isShuffleDisabled(1);
    },
    isShuffle5Disabled() {
      return this.isShuffleDisabled(2);
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
