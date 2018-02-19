
//IEFE
(function() {
	const modal = document.querySelector('#modal');
	const modalContent = document.querySelector('.modal-content');
	const close = document.querySelector('.close');
	const path = "https://randomuser.me/api/?results=12&nat=us";

	let state = {
	    user: [],
	    filteredUsers: [],
	    modalWindow: false,
	    modalIndex: 0
	};



	let getData = {
		loadJSON: function(path, callback) {
			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if ( this.readyState !== 4 ) {return;}
				if ( this.readyState == 4 && this.status == 200 ) {
					console.log(xhr);


					const jsonResponse = JSON.parse(xhr.response).results;
					callback(jsonResponse);
				} else {
					console.log('The request has failed.');
				}
				console.log('This always will run.');
			};
			xhr.open( 'GET', path );
			xhr.send();
		}
	}

	

	let render = {
		employeeCards: function() {
		const container = document.querySelector('.container');
		container.innerHTML = '';
		state.user.forEach((user, index) => {
		    let userCard = document.createElement("div");
		    userCard.classList = 'user-card';
		    userCard.innerHTML =

        	    `<img src="${user.picture.medium}">
        	       <div class="user-info">
        	        <h2 class="user-name">${titleCase(user.name.first)} ${titleCase(user.name.last)}</h2>
        	        <p class="email">${user.email}</p>
        	        <p class="location">${titleCase(user.location.city)}</p>
        	       </div>
        	   </div>`;
		    userCard.addEventListener('click', event => {
		    	console.log('emloyee card clicked')
		        state.modalWindow = true;
		        state.modalIndex = index;
		        this.employeeModal();
		    });
		    container.appendChild(userCard);
		  });
		},
		employeeModal: function() {
			if (state.modalWindow) {
			    document.body.style.overflow = 'hidden';
			    var user = state.user[state.modalIndex];
			    // var d = user.dob.slice(0, 10).split('-');

			    modalContent.innerHTML =
		        	`<button id="close" class="close">X</button>
	    	            <img src=${user.picture.large}>
	    	            <h2 class="user-name">${titleCase(user.name.first)} ${titleCase(user.name.last)}</h2>
	    	            <p class="email">${user.email}</p>
	    	            <p class="location">${titleCase(user.location.city)}</p>

	    	            
	                    <p class="phone">${user.phone}</p>
	    	            <p class="address">${titleCase(user.location.street)}, ${titleCase(user.location.city)}, ${user.location.postcode}, ${user.nat}</p>
	    	            
	                    <div class="modal-buttons">
	                    <button id="previous" class="previous">Previous</button>
	                    <button id="next" class="next">Next</button>
	                    </div>
	    	        </div>`
			  
			    modalContent.querySelector('.close').addEventListener('click', function(event) {
			        console.log(event);
	                event.preventDefault();
			        state.modalWindow = false;
			        render.employeeModal();
			    },this);
	            modalContent.querySelector('.previous').addEventListener('click', function(event) {
	                if (state.modalIndex === 0) {
	                    state.modalIndex = state.user.length - 1;
	                } else {
	                    state.modalIndex --;
	                }
	                render.employeeModal();
	            },this);
	            modalContent.querySelector('.next').addEventListener('click', function(event) {
	                if (state.modalIndex === state.user.length - 1) {
	                    state.modalIndex = 0;
	                } else {
	                    state.modalIndex ++;
	                }
	                render.employeeModal();
	            },this);

			    modal.style.display = "block";
			} else {
			    document.body.style.overflow = '';
			    modal.style.display = "none";
			}
		}

	}





	function makeElement(type) {
		return document.createElement(type);
	}

    function titleCase(str) {
        str = str.toLowerCase();
        str = str.split(" ");
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
    }


	
	function init() {
	    getData.loadJSON(path, user => {
	    	console.log(user);
	        state.user = user;
	        render.employeeCards();
	    });
	}

	init();

})();
