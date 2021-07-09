import tooltipDirective from "./tooltip";
import clickOutsideDirective from "./click-outside";

// register all directives
const directives = (app) => {
  app.directive("tooltip", tooltipDirective);
  app.directive("click-outside", clickOutsideDirective);
};

export default directives;
