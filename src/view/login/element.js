define(['./style.css'], () => ({
  name: 'login-view',
  props: {
    next: {
      type: String,
      required: true,
    },
    error: {
      type: String,
      required: false,
      default: null,
    },
  },
  computed: {
    errorMessage() {
      switch (this.error) {
        case 'not_found':
          return 'Seems like some mistake in the username';
        case 'not_match':
          return 'Seems like some mistake in the password';
        default:
          return 'Something not going right';
      }
    },
  },
  methods: {
    renderToolbar(h) {
      return h('v-toolbar', {
        attrs: {
          color: 'primary',
          dark: true,
        },
      }, [
        h('v-toolbar-title', 'Login'),
      ]);
    },
    renderCardText(h) {
      return h('v-card-text', [
        this.error ? h('span', {
          staticClass: 'red--text',
        }, this.errorMessage) : h(),
        h('v-text-field', {
          attrs: {
            name: 'username',
            label: 'Username',
            autofocus: true,
            required: true,
          },
        }),
        h('v-text-field', {
          attrs: {
            name: 'password',
            type: 'password',
            label: 'Password',
            required: true,
          },
        }),
      ]);
    },
    renderCardAction(h) {
      return h('v-card-actions', [
        h('v-btn', {
          staticClass: 'primary--text',
          attrs: {
            flat: true,
            type: 'submit',
          },
        }, 'Login'),
      ]);
    },
  },

  render(h) {
    return h('v-app', {
      props: {
        id: 'app',
      },
    }, [
      h('v-content', [
        h('v-container', {
          attrs: {
            fluid: true,
          },
        }, [
          h('form', {
            attrs: {
              method: 'post',
              action: '/login',
            },
          }, [
            h(
              'v-layout', {
                attrs: {
                  row: true,
                  wrap: true,
                },
              },
              [
                h('v-flex', {
                  attrs: {
                    'offset-md3': true,
                    md6: true,
                    xs12: true,
                  },
                }, [
                  h('v-card', [
                    this.renderToolbar(h),
                    this.renderCardText(h),
                    this.renderCardAction(h),
                  ]),
                ]),
              ],
            ),
            h('input', {
              attrs: {
                type: 'hidden',
                name: 'next',
                value: this.next,
              },
            }),
          ]),
        ]),
      ]),
    ]);
  },
}));
