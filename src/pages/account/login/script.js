export default {
  components: {
    BodyDisplay: () => import('../../../layouts/BodyDisplay.vue'),
  },
  data() {
    return {
      username: '',
      password: '',
    };
  },
};
