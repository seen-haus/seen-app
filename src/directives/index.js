import tooltipDirective from "./tooltip";

// register all directives
const directives = (app) => {
  app.directive("tooltip", tooltipDirective);
};

export default directives;
