<template>
  <div id="app">
    <div class="container">
      <div class="page-header">
        <h1>Bitcoin Cash Privacy Game</h1>
      </div>
      <div class="row">
        <div class="col-md-2 mb-2">
          <img height="100" src="./assets/logo.png">
        </div>
        <div class="col-md-8">
          <p>With the inclusion of the <a href="https://cashshuffle.com">Cash Shuffle</a> plug-in in Electron Cash by default (soon &#8482;) an important privacy tool becomes easily available. If a similar integration is included in a popular mobile wallet (soonish &#128591;) then privacy in Bitcoin Cash will be greatly improved. Privacy within the crowds.</p>
          
          <p>The following series of games intend to show how coins can be tracked and how hard or easy it is to get rid of that tracking. This should help understand how cash shuffle helps and how it compares with traditional mixers.</p>
          <button type="button" class="btn btn-warning" v-on:click="scrollToGame">Start</button>
        </div>
      </div>
    </div>
    

    <game id="game1" next="game2" showhelp 
          v-bind:coins="[
            { value: 2000, tag: 'rent' }
          ]">
      <template slot="title">Game 1 - Let there be coins!</template>
      <template slot="finalMessage">
        <p>Most wallets just show a balance but you're actually splitting and joining coins. Just by knowing that, and that each coin can be tracked individually, you can improve your privacy.</p>
      </template>
    </game>
    <game id="game2" next="game3" showmixer showmixerhelp
          v-bind:coins="[
            { value: 510, tag: 'rent' }
          ]">
      <template slot="title">Game 2 - Into the mix</template>
      <template slot="finalMessage">
        <p>A mixer is convenient because it can provide an easy to use service that takes care of breaking all tracking between coins. Nevertheless you need to trust the service. A bad mixer can take your money or give you coins with a worse history than the ones you had.</p>
      </template>
    </game>
    <game id="game3" showshuffle showshufflehelp
          v-bind:coins="[
            { value: 510, tag: 'rent' }
          ]">
      <template slot="title">Game 3 - Everybody Shuffling!</template>
      <template slot="finalMessage">
        <p>You have to perform several shuffles because the tracking information is not lost, just made weaker. And you also need to generate coins of the same exact value as others do which can be inconvenient.</p>
        <p>Cash Shuffle requires more work if done manually. On the other hand, it can be done by wallets automatically during the night, is cheaper than mixers, and requires no trusted service.</p>
        <a href="https://cashshuffle.com" target="_blank">Check Cash Shuffle!</a>
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
  methods: {
    scrollToGame: function() {
      var game = this.$el.querySelector("#game1");
      scrollTo(0, game.offsetTop);
      location.hash = "#game1";
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
