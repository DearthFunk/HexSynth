angular.module('localStorageServiceModule', [])
	.service("localStorageService", function(){

		var localStorageServiceScope = this;

		localStorageServiceScope.storage = JSON.parse(localStorage.getItem('hexSynthDearthFunkSaveObject'));
		if (localStorageServiceScope.storage != null) {
			if ('active' in localStorageServiceScope.storage) {
				if (localStorageServiceScope.storage.active){ localStorageServiceScope.storage = false}
			}
			else {
				localStorageServiceScope.storage = false;
			}
		}
		else {
			localStorageServiceScope.storage = false;
		}

	});

