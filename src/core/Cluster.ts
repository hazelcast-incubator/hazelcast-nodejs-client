/*
 * Copyright (c) 2008-2019, Hazelcast, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {MembershipListener} from './MembershipListener';
import {UUID} from './UUID';
import {Member} from './Member';
import {MemberSelector} from './MemberSelector';

export interface Cluster {
    /**
     * Adds MembershipListener to listen for membership updates.
     * <p>
     * The addMembershipListener method returns a register ID. This ID is needed to remove the MembershipListener using the
     * {@link #removeMembershipListener} method.
     * <p>
     * If the MembershipListener implements the {@link InitialMembershipListener} interface, it will also receive
     * the {@link InitialMembershipEvent}.
     * <p>
     * There is no check for duplicate registrations, so if you register the listener twice, it will get events twice.
     *
     * @param listener membership listener
     * @return the registration ID
     * @throws AssertionError if listener is null
     * @see #removeMembershipListener
     */
    addMembershipListener(listener: MembershipListener): UUID;

    /**
     * Removes the specified MembershipListener.
     * <p>
     * If the same MembershipListener is registered multiple times, it needs to be removed multiple times.
     *
     * This method can safely be called multiple times for the same registration ID; subsequent calls are ignored.
     *
     * @param registrationId the registrationId of MembershipListener to remove
     * @return true if the registration is removed, false otherwise
     * @throws AssertionError if the registration ID is null
     * @see #addMembershipListener
     */
    removeMembershipListener(registrationId: UUID): boolean;

    /**
     * List of the current members in the cluster.
     * <p>
     * Every member in the cluster returns the 'members' in the same order.
     * To obtain the oldest member (the master) in the cluster, you can retrieve the first item in the list.
     *
     * @param memberSelector {@link MemberSelector} instance to filter members to return
     * @return current members in the cluster
     */
    getMembers(memberSelector?: MemberSelector): Member[];

    /**
     * List of the current members in the cluster.
     * <p>
     * Every member in the cluster returns the 'members' in the same order.
     * To obtain the oldest member (the master) in the cluster, you can retrieve the first item in the list.
     *
     * @return current members in the cluster
     */
    getMemberList(): Member[];
}
