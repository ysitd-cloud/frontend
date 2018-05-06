define(['../../stateful.js', './style.css'], (StatefulElement) => {
  class ComponentInput extends StatefulElement {
    static get is() {
      return 'component-input';
    }

    constructor() {
      super();
      this.state = {
        errorMessage: '',
        value: '',
      };
    }

    render(h) {
      const attributes = ['type', 'name', 'required', 'autofocus', 'value'].reduce((attrs, attr) => {
        if (attr in this.props) {
          attrs[attr] = this.props[attr];
        }
        return attrs;
      }, {
        'aria-label': this.props.label,
      });

      attributes.type = attributes.type || 'text';

      return [
        h('label', this.props.label),
        h(
          'div', {
            'data-role': 'input',
          },
          h('input', Object.assign(attributes, {
            onFocus: () => {
              this.classList.add('dirty', 'focus');
            },
            onBlur: (e) => {
              if (!e.target.value) {
                this.classList.remove('dirty');
              }
              this.classList.remove('focus');
            },
            onInput: (e) => {
              this.setState({ value: e.target.value });
              if (this.valid) {
                this.classList.remove('error');
              } else {
                this.classList.add('error');
                this.setState({
                  errorMessage: 'This field is required',
                });
              }
              this.dispatchEvent(new Event('input', {
                bubbles: true,
                cancelable: false,
              }));
            },
          })),
        ),
        h(
          'div',
          {
            'data-role': 'detail',
          },
          h('div', { 'data-role': 'message' }, this.state.errorMessage),
        ),
      ];
    }

    get valid() {
      return this.state.value || !this.hasAttribute('required');
    }
  }

  customElements.define(ComponentInput.is, ComponentInput);
});
