All you need to do (as it was partially mentioned) is to preload translations using `.use()` method. The problem is the method is async (we should wait for the result). The best way to force the application to wait for "something" to finish before it shows up is using `APP_INITIALIZER` function in your AppModule.

You have to add following provider to your AppModule's providers section:
```typescript
providers: [
  {
    provide: APP_INITIALIZER,
    useFactory: appInitializerFactory,
    deps: [TranslateService, Injector],
    multi: true
  }
]
```
And define factory function appInitializerFactory upper in the same file:
```typescript
import { Injector, APP_INITIALIZER } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LOCATION_INITIALIZED } from '@angular/common';

export function appInitializerFactory(translate: TranslateService, injector: Injector) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const langToSet = 'en-GB'
      translate.setDefaultLang('en-US');
      translate.use(langToSet).subscribe(() => {
        console.info(`Successfully initialized '${langToSet}' language.'`);
      }, err => {
        console.error(`Problem with '${langToSet}' language initialization.'`);
      }, () => {
        resolve(null);
      });
    });
  });
}
```
Now application will wait for translations initialization before it shows up for user.