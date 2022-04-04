import { PlanningService } from './../components/planning/plannig.service';
import { User } from 'src/app/components/user/user';
import { UserStorage } from './../components/user/user.storage';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';  

@Injectable({
	providedIn: 'root'
})
export class SocketService {

	isConnected: boolean = true;
	private socketService: Socket;

	constructor(
		socket: Socket, 
		userStorage: UserStorage,
		planningService: PlanningService,
	) {
		this.socketService = socket;

		this.socketService.on('connect', function () {
			if (this.isConnected == false) {
				const user = userStorage.user;

				planningService.findUser('', user.id).subscribe((users: User[]) => {
					if (users.length > 0) {
					  const planningUser = users[0];

					  if (planningUser && planningUser.id) {
						  if (this.socketService) {
							  this.socketService.emit('user-join', planningUser.id.toString());
						  }
					  }
					}
				});
			}

			this.isConnected = true;
		});

		this.socketService.on('disconnect', function () {
			this.isConnected = false;
		});
	}

	/**
	 * Join sprint room
	 */
	join(sprintId: string) {
		this.socketService.emit('room', sprintId);
	}

	/**
	 * Store user id on room
	 */
	connectUser(userId: string) {
		this.socketService.emit('user-join', userId);
	}

	/**
	 * Listen for ui messages
	 */
	onUserDisconnect() {
		return this.socketService.fromEvent('user-unjoin');
	}

    /**
	 * Emit ui message
	 */
	 fetchMessages(message: string) {
		this.socketService.emit('fetchMessages', message);
	} 

	/**
	 * Listen for ui messages
	 */
	onFetchMessages() {
		return this.socketService.fromEvent('fetchMessages');
	}

	/**
	 * Emit users changed event
	 */
	fetchUsers() {
		this.socketService.emit('fetchUsers');
	} 

	/**
	 * Listen for users changed event
	 */
	onFetchUsers() {
		return this.socketService.fromEvent('fetchUsers');
	}

	/**	
	 * Emit planning users changed event
	 */
	fetchPlanningUsers() {
		this.socketService.emit('fetchPlanningUsers');
	} 
	
	/**
	 * Listen for planning users changed event
	 */
	onFetchPlanningUsers() {
		return this.socketService.fromEvent('fetchPlanningUsers');
	}
	
	/**
	 * Emit actions changed event
	 */
	fetchActions() {
		this.socketService.emit('fetchActions');
	} 

	/**
	 * Listen for actions event
	 */
	 onFetchActions() {
		return this.socketService.fromEvent('fetchActions');
	}

	/**
	 * Emit itens changed event
	 */
	 fetchItens() {
		this.socketService.emit('fetchItens');
	} 

	/**
	 * Listen for Itens event
	 */
	 onFetchItens() {
		return this.socketService.fromEvent('fetchItens');
	}

	/**
	 * Emit clear votes event
	 */
	fetchClearVotes() {
		this.socketService.emit('fetchClearVotes');
	} 

	/**
	 * Listen to clear votes event
	 */
	onFetchClearVotes() {
		return this.socketService.fromEvent('fetchClearVotes');
	}

	/**
	 * Emit voted item event
	 */
	fetchVotedItem() {
		this.socketService.emit('fetchVotedItem');
	} 

	/**
	 * Listen to voted item event
	 */
	onFetchVotedItem() {
		return this.socketService.fromEvent('fetchVotedItem');
	}

	/**
	 * Emit keep alive event
	 */
	 keepAlive() {
		this.socketService.emit('keepAlive');
	}

	/**
	 * Try to reconnect into socket
	 */
	reConnect() {
		setTimeout(() => {
			const service = this.socketService.connect();

			if (service) {
				this.socketService = service;
			}

			if (this.isConnected) {
				this.reConnect();
			}
		}, 1000);
	}
}