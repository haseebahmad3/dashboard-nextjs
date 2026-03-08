"use client"

import TicketType from '@/app/types/tickets'
import SLARules from '@/app/data/sla_rules.json'
import { useRouter } from 'next/router';

export default function Ticket({
id,
title,
customerName,
customerTier,
status,
priority,
createdAt,
lastUpdatedAt,
assignedTo,
channel,
issueType,
description
}: TicketType) {

    var state = "";
    var score;

    if (status !== "open") { //unresolved
       SLARules.forEach(SLA => {
        const customerTier = SLA.customerTier;
        const priority = SLA.priority;
        const hours = SLA.hours;

        if (hours < 12) { //put allowed time window as 24
            state = "Safe";
        }
        else if ((hours > 12) && (hours <= 24)) {
            state = "At risk"
        }
        else if (hours > 24) {
            state = "Breached"
        }
        
       });
    }

    function scoreTickets() {
        if (customerTier === "Enterprise" && priority.toLowerCase() === "high") {
            score = 100;
        }
        else if (customerTier === "Enterprise" && priority.toLowerCase() === "medium") {
            score = 70;
        }
        else if (customerTier === "Enterprise" && priority.toLowerCase() === "low") {
            score = 50;
        }
        else if (customerTier === "pro" && priority.toLowerCase() === "high") {
            score = 70;
        }
        else if (customerTier === "pro" && priority.toLowerCase() === "medium") {
            score = 50;
        }
        else if (customerTier === "pro" && priority.toLowerCase() === "low") {
            score = 30;
        }
        else if (customerTier === "basic" && priority.toLowerCase() === "high") {
            score = 50;
        }
        else if (customerTier === "basic" && priority.toLowerCase() === "medium") {
            score = 30;
        }
        else if (customerTier === "basic" && priority.toLowerCase() === "low") {
            score = 10;
        }
        else {
            score = 0;
        }
    }

    scoreTickets();

    return (
        <div className="bg-emerald-200 border p-4">
            <div>
                <p>Ticket Id: {id.trim()}</p>
                <p>title: {title.trim()}</p>
                <p>customerName: {customerName.trim()}</p>
                <p>customerTier: {customerTier.trim()}</p>
                <p>status: {status.trim()}</p>
                <p>priority: {priority.trim()}</p>
                <p>created at: {createdAt.trim()}</p>
                <p>lastUpdatedAt: {typeof lastUpdatedAt === "string" ? lastUpdatedAt : "No data to show"}</p>
                <p>assignedTo: {assignedTo === null ? "No data to show" : assignedTo}</p>
                <p>channel: {channel.trim()}</p>
                <p>issueType: {issueType.trim()}</p>
                <p>description: {description.trim()}</p>
                <p className='w-full bg-red-500 text-white font-bold'>State: {state}</p>
                <p>Score: {score}</p>
            </div>
        </div>
    )
}