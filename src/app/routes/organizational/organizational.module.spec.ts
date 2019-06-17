import { OrganizationalModule } from './organizational.module';

describe('OrganizationalModule', () => {
  let organizationalModule: OrganizationalModule;

  beforeEach(() => {
    organizationalModule = new OrganizationalModule();
  });

  it('should create an instance', () => {
    expect(organizationalModule).toBeTruthy();
  });
});
