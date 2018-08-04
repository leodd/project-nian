import MasonaryLayout from './src/MasonaryLayout.vue';

function install (Vue, opts={}) {
  Vue.component(opts.name || 'masonary-layout', MasonaryLayout);
}

export default {
  install,
  MasonaryLayout
};
