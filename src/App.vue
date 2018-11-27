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
    

    <game></game>
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
}
</style>
