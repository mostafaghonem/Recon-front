<template>
  <v-footer id="core-footer" absolute height="82">
    <v-spacer />
    <div
      class="footer-items"
      style="    margin-right: 40%;
    direction: rtl;
    line-height: 10px;"
    >
<!-- 
      <p  >
        جهـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــاز الإستطــــــــــــــــــــــــــــــــــــــــــــــــــلاع
      </p>
      <p style="padding-right: 18px">فــــــــــــــــــــــــــرع نظـــــــــــــــــــم المعلومـــــــــــــــــات             </p> -->

<!-- 
      <p>
        إدارة المخابرات الحربية والإستطلاع -
        <a class="content-link" href="http://www.mod.gov.eg"
          >وزارة الدفاع ق.م</a
        >
      </p> -->
      <!-- <div>تصميم وتنفيذ فرع النظم جهاز الإستطلاع</div> -->

      <!-- <span v-for="link in links" :key="link.name">
        <a :href="link.Link" class="footer-links">{{ link.name }}</a>
      </span> -->
    </div>
    <!-- <v-spacer />
    <span class="font-weight-light copyright">
      &copy;
      {{ new Date().getFullYear() }}
      <a href="https://www.creative-tim.com/" target="_blank">Creative Tim</a>,
      made with
      <v-icon color="tertiary" size="17">mdi-heart</v-icon>
      for a better web
    </span> -->
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    links: [
      { name: "Dashboard", Link: "/dashboard" },
      { name: "Creative Tim", Link: "https://www.creative-tim.com" },
      { name: "About Us", Link: "https://creative-tim.com/presentation" },
      { name: "Blog", Link: "https://blog.creative-tim.com" }
    ]
  })
};
</script>

<style>
#core-footer {
  z-index: 0;
}
</style>
