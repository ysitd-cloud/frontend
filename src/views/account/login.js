import App from '../../pages/account/login/Page.vue';
import bootstrap from '../../common/bootstrap';
import store from '../../common/store';
import { bind } from '../../common/url';

bind(store);
bootstrap(App);
