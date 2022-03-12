import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';  

@Injectable({
	providedIn: 'root'
})
export class SocketService {

	constructor(private socket: Socket) { }

	/**
	 * Join sprint room
	 */
	join(sprintId: string) {
		this.socket.emit('room', sprintId);
	}

	/**
	 * Store user id on room
	 */
	connectUser(userId: string) {
		this.socket.emit('user-join', userId);
	}

	/**
	 * Listen for ui messages
	 */
	onUserDisconnect() {
		return this.socket.fromEvent('user-unjoin');
	}

    /**
	 * Emit ui message
	 */
	 fetchMessages(message: string) {
		this.socket.emit('fetchMessages', message);
	} 

	/**
	 * Listen for ui messages
	 */
	onFetchMessages() {
		return this.socket.fromEvent('fetchMessages');
	}

	/**
	 * Emit users changed event
	 */
	fetchUsers() {
		this.socket.emit('fetchUsers');
	} 

	/**
	 * Listen for users changed event
	 */
	onFetchUsers() {
		return this.socket.fromEvent('fetchUsers');
	}

	/**	
	 * Emit planning users changed event
	 */
	fetchPlanningUsers() {
		this.socket.emit('fetchPlanningUsers');
	} 
	
	/**
	 * Listen for planning users changed event
	 */
	onFetchPlanningUsers() {
		return this.socket.fromEvent('fetchPlanningUsers');
	}
	
	/**
	 * Emit actions changed event
	 */
	fetchActions() {
		this.socket.emit('fetchActions');
	} 

	/**
	 * Listen for actions event
	 */
	 onFetchActions() {
		return this.socket.fromEvent('fetchActions');
	}

	/**
	 * Emit itens changed event
	 */
	 fetchItens() {
		this.socket.emit('fetchItens');
	} 

	/**
	 * Listen for Itens event
	 */
	 onFetchItens() {
		return this.socket.fromEvent('fetchItens');
	}

	/**
	 * Emit clear votes event
	 */
	fetchClearVotes() {
		this.socket.emit('fetchClearVotes');
	} 

	/**
	 * Listen to clear votes event
	 */
	onFetchClearVotes() {
		return this.socket.fromEvent('fetchClearVotes');
	}
}