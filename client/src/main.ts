import { enableProdMode, NgModuleRef, ApplicationRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { createNewHosts } from '@angularclass/hmr';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const bootstrapHMR = function(bootstrap: () => Promise<NgModuleRef<any>>) {
  let ngModule: NgModuleRef<any>;
  module.hot.accept();

  bootstrap().then(mod => ngModule = mod);
  module.hot.dispose(() => {
    const appRef: ApplicationRef = ngModule.injector.get(ApplicationRef);
    const elements = appRef.components
      .map(component => component.location.nativeElement);
    const makeVisible = createNewHosts(elements);

    ngModule.destroy();
    makeVisible();
  });
};

const bootstrap = function () {
  return platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
};

if (environment.hmr) {
  if (module.hot) {
    bootstrapHMR(bootstrap);
  } else {
    console.error('HMR is not enabled for webpack-dev-server! use the --hmr flag with ng serve');
  }
} else {
  bootstrap();
}
