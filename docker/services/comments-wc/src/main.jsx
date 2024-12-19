import './comments-drawer-element';

window.renderCommentsDrawer = (props = {}) => {
  
  let container = document.getElementById('comments-drawer-container');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'comments-drawer-container';
    container.style.position = 'fixed';
    container.style.zIndex = '99999';
    container.style.right = '0';
    container.style.bottom = '0';
    document.body.appendChild(container);
  } else {
    container.innerHTML = '';
  }

  const drawerElement = document.createElement('comments-drawer-element');

  for (const [key, value] of Object.entries(props)) {
    drawerElement[key] = value;
  }

  if (props.filter_id !== undefined) {
    drawerElement.filter_id = props.filter_id;
  }

  container.appendChild(drawerElement);
  

};

const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const filterId = params.get('filters');
  return filterId;
};

const initCommentsDrawer = () => {
  const filterId = getQueryParams();

  if (filterId) {
    const props = { filter_id: filterId };
    window.renderCommentsDrawer(props);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initCommentsDrawer();
});
