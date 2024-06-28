import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "auth", loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule)},
  { path: "home", loadChildren: () => import("./pages/pages.module").then(m => m.PagesModule), data: {breadCrumb: "Inicio"}},
  { path: "**", redirectTo: "auth" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
