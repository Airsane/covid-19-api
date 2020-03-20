<template>
  <div class="home">
    <div class="auto" style="width: 50%; margin: auto;">
      <input type="text" id="countySearch" placeholder="Write country name" class="form-control" />
    </div>

    <div class="container-fluid row m-auto">
      <div
        v-for="d in data"
        :key="d.name"
        :data-name="d.name"
        class="col-md-3 mb-3 mt-3"
        style="font-size:20px"
      >
        <h1>{{d.name}}</h1>
        Total Cases: {{d.totalC}}
        <br />
        New Cases: {{d.newC}}
        <br />Total Deaths:
        <b class="text-danger">{{d.totalD}}</b>
        <br />New Deaths:
        <b class="text-danger">{{d.newD}}</b>
        <br />Total Recovered:
        <b class="text-success">{{d.totalR}}</b>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

export default {
  name: "Home",
  async created() {
    this.data = await axios.get("https://covid-19-api.glitch.me/api/country/All");
    this.data = this.data.data;
  },
  data() {
    return {
      data: null
    };
  },
};
</script>
