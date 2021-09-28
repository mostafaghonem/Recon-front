<template>
  <v-content>
    <div id="core-view" style="margin-top:40px">
      <v-fade-transition mode="out-in" style="position:relative">
        
        <!-- <img src="./شعار هيئة الاستخبارات1.png" style="position:absolute;top:40%;left:40%;"> -->

        <nuxt />
      </v-fade-transition>
    </div>
    <core-footer v-if="false" />
  </v-content>
</template>

<script>
import coreFooter from "~/components/core/AppFooter";

export default {
  metaInfo() {
    return {
      title: "Vuetify Material Dashboard by CreativeTim"
    };
  },
  components: {
    coreFooter
  }
};
</script>

<style>
#core-view {
  padding-bottom: 100px;
}
/* .v-content{
  margin-top: 8px!important;
  margin-left: 0px!important;
} */
.container.fill-height.fluid.grid-list-xl.dir.dark{
padding-left:0!important;padding-right:0!important;
padding-top: 20px;
}
</style>
