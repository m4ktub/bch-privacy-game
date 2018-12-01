<template>
  <div id="app">
    <div id="game0" class="container" v-show="showIntro">
      <div class="page-header">
        <h1>Bitcoin Cash Privacy Game</h1>
      </div>
      <div class="row">
        <div class="col-md-2 mb-2">
          <img height="100" src="./assets/logo.png">
        </div>
        <div class="col-md-8">
          <p>With the inclusion of the <a href="https://cashshuffle.com">Cash Shuffle</a> plug-in in Electron Cash by default (soon &#8482;) an important privacy tool becomes easily available. If a similar integration is included in a popular mobile wallet (soonish &#128591;) then privacy in Bitcoin Cash will be greatly improved. Privacy within the crowds!</p>
          
          <p>The following mini games show that coins can be tracked with labels and how hard or easy it is to get rid of that tracking. This should help understand how cash shuffle helps and how it compares with traditional mixers.</p>
          <button type="button" class="btn btn-warning" v-on:click="showGame('game1')">Start</button>
        </div>
      </div>
    </div>
    
    <game id="game1" v-show="showgame1" next="game2" showhelpdrag showhelppayment showlandlord
          v-bind:coins="[
            { value: 500, tag: 'rent' },
            { value: 500 }
          ]">
      <template slot="title">Game 1 - Let there be coins!</template>
      <template slot="finalMessage">
        <p>Most wallets just show a balance but you're actually working with individual coins underneath. If you know about coins, and that each coin can be tracked individually, you can improve your privacy.</p>
      </template>
    </game>
    <game id="game2" v-show="showgame2" next="game3" showhelpactions showhelpreset
          v-bind:coins="[
            { value: 200, tag: 'rent' },
            { value: 200, tag: 'rent' },
            { value: 200, tag: 'rent' }
          ]">
      <template slot="title">Game 2 - Split and Join</template>
      <template slot="finalMessage">
        <p>Splitting and joining coins is the most basic thing you can do to limit how other people track your money. If you join all coins, for a single payment, then you show everyone they are all yours.</p>
      </template>
    </game>
    <game id="game3" v-show="showgame3" next="game4" showmixer showmixerhelp
          v-bind:coins="[
            { value: 500, tag: 'rent' }
          ]">
      <template slot="title">Game 3 - Into the mix</template>
      <template slot="finalMessage">
        <p>A mixer is convenient because it can provide an easy to use service that takes care of breaking all tracking between coins. Nevertheless you need to trust the service. A bad mixer can take your money or give you coins with a worse history than the ones you had.</p>
      </template>
    </game>
    <game id="game4" v-show="showgame4" next="game5" showshuffle showshufflehelpauto
          v-bind:coins="[
            { value: 500, tag: 'rent' }
          ]">
      <template slot="title">Game 4 - Everybody's Shuffling!</template>
      <template slot="finalMessage">
        <p>Cash Shuffle can produce consistent results with a cost that is competitive (and probably smaller) than a trusted mixer. The trick is in collaborating (and sharing costs) with other people which results in everyone having coins with the same values and greater privacy.</p>
        <p>
          <a href="https://cashshuffle.com" target="_blank">Check Cash Shuffle!</a>
        </p>
      </template>
    </game>
    <game id="game5" v-show="showgame5" showshuffle showshufflehelp
          v-bind:coins="[
            { value: 500, tag: 'rent' }
          ]">
      <template slot="title">Game 5 - Hard Shuffle</template>
      <template slot="finalMessage">
        <p>The tracking information is made <i>weaker</i> with each shuffle and you also need to produce coins of the same value as everybody else. This is why you need to perform all these iterations.</p>
        </p>Wallets will automatically shuffle the coins during the night, for example, so that you don't need to bother and still have good privacy whenever you need to make a payment.</p>
        <p>
          <a href="https://cashshuffle.com" target="_blank">Check Cash Shuffle!</a>
        </p>
      </template>
    </game>
  </div>
</template>

<script>
import Game from "./components/Game";

export default {
  name: "app",
  components: {
    Game
  },
  data() {
    return {
      showIntro: true,
      showgame1: false,
      showgame2: false,
      showgame3: false,
      showgame4: false,
      showgame5: false
    };
  },
  mounted() {
    if (location.hash.startsWith("#game")) {
        this.showGame(location.hash.substring(1));
        this.showIntro = false;
    }
  },
  methods: {
    scrollToGame: function() {
      //var game = this.$el.querySelector("#game1");
      //scrollTo(0, game.offsetTop);
      location.hash = "#game1";
      this.showIntro = false;
    },
    showGame(gameId) {
        location.hash = "#" + gameId;
        this["showgame1"] = false;
        this["showgame2"] = false;
        this["showgame3"] = false;
        this["showgame4"] = false;
        this["showgame5"] = false;
        this["show" + gameId] = true;
        this.showIntro = false;
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

.container {
  height: 100%;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 50px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i.selector {
  cursor: pointer;
}

.help {
  cursor: pointer;
}

.list-group-item.selected {
  background-color: #d9edf7 !important;
}

.game {
  height: 100%;
  min-heigth: 400px;
}
</style>
