// src/App.js
'use client'
import React, { useEffect, useState } from "react";
import {ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {   Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue, } from "@/components/ui/select";

const initialNodes = [];
const initialEdges = [];

export default function GraphEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState("");
  const [nodeType, setNodeType] = useState("");
  const [heuristic, setHeuristic] = useState("");
  const [edgeCost, setEdgeCost] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState("");
  const [selectedEdge, setSelectedEdge] = useState(null);
  // const { setElements } = useReactFlow();
  useEffect(() => {
    const handleDelete = (event) => {
      if (event.key === "Delete") {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
      }
    };

    window.addEventListener("keydown", handleDelete);
    return () => {
      window.removeEventListener("keydown", handleDelete);
    };
  }, [setNodes, setEdges]);

  const updateEdgeCost = (edgeId, cost) => {
    setEdges((eds) => eds.map(edge => edge.id === edgeId ? { ...edge, label: cost } : edge));
  };

  const traverseGraphStepByStep = async (path) => {
    for (let i = 0; i < path.length; i++) {
      setHighlightedNode(path[i]);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
    }
    setHighlightedNode(null);
  };

  const addNode = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      data: { label: nodeName, heuristic, type: nodeType },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onConnect = (params) => {
    const newEdge = { ...params, label: edgeCost };
    setEdges((eds) => addEdge(newEdge, eds));
  };
  const highlightPath = async (path) => {
    for (let i = 0; i < path.length; i++) {
      setHighlightedNodes(path.slice(0, i + 1));
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };


  const deleteNode = (nodeId) => {
    setNodes((nds) => nds.filter(node => node.id !== nodeId));
    setEdges((eds) => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
  };

  const deleteEdge = (edgeId) => {
    setEdges((eds) => eds.filter(edge => edge.id !== edgeId));
  };

  const bfsSearch = async () => {
    let queue = [];
    let visited = new Set();
    let startNode = nodes.find(node => node.data.type === "Start");
    if (!startNode) return;
    queue.push(startNode.id);
    visited.add(startNode.id);
    let path = [];
    while (queue.length) {
      console.log(queue)
      let nodeId = queue.shift();
      path.push(nodeId);
      let neighbors = edges.filter(edge => edge.source === nodeId).map(edge => edge.target);
      console.log(neighbors)
      for (let neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    setSearchResult(`BFS Path: ${path.join(" -> ")}`);
    await highlightPath(path);
  };

  const dfsSearch = async () => {
    let stack = [];
    let visited = new Set();
    let startNode = nodes.find(node => node.data.type === "Start");
    console.log(nodes)
    if (!startNode) return;
    stack.push(startNode.id);
    let path = [];
    while (stack.length) {
      let nodeId = stack.pop();
      if (!visited.has(nodeId)) {
        visited.add(nodeId);
        path.push(nodeId);
        let neighbors = edges.filter(edge => edge.source === nodeId).map(edge => edge.target);
        stack.push(...neighbors);
      }
    }
    setSearchResult(`DFS Path: ${path.join(" -> ")}`);
    await highlightPath(path);
  };

  const aStarSearch = async () => {
    let openSet = [];
    let cameFrom = {};
    let gScore = {};
    let fScore = {};
    let startNode = nodes.find(node => node.data.type === "Start");
    let goalNode = nodes.find(node => node.data.type === "Goal");
    console.log(nodes)
    if (!startNode || !goalNode) return;
    nodes.forEach(node => {
      gScore[node.id] = Infinity;
      fScore[node.id] = Infinity;
    });
    gScore[startNode.id] = 0;
    fScore[startNode.id] = parseFloat(startNode.data.heuristic) || 0;
    openSet.push(startNode.id);
    while (openSet.length) {
      openSet.sort((a, b) => fScore[a] - fScore[b]);
      let current = openSet.shift();
      if (current === goalNode.id) {
        let path = [];
        while (current) {
          path.unshift(current);
          current = cameFrom[current];
        }
        setSearchResult(`A* Path: ${path.join(" -> ")}`);
        await highlightPath(path);
        return;
      }
      let neighbors = edges.filter(edge => edge.source === current);
      for (let edge of neighbors) {
        let neighbor = edge.target;
        let tentativeGScore = gScore[current] + parseFloat(edge.label || 1);
        if (tentativeGScore < gScore[neighbor]) {
          cameFrom[neighbor] = current;
          gScore[neighbor] = tentativeGScore;
          fScore[neighbor] = gScore[neighbor] + (parseFloat(nodes.find(n => n.id === neighbor)?.data.heuristic) || 0);
          if (!openSet.includes(neighbor)) openSet.push(neighbor);
        }
      }
    }
    setSearchResult("A* Search could not find a path.");
  };

  return (
    <div className="flex flex-col h-screen">
    <div className="p-4 bg-gray-200 flex gap-2">
      <Input
        placeholder="Node Name"
        value={nodeName}
        onChange={(e) => setNodeName(e.target.value)}
      />
      <Input
        placeholder="Heuristic"
        type="number"
        value={heuristic}
        onChange={(e) => setHeuristic(e.target.value)}
      />
        <Select defaultValue={nodeType} onValueChange={(e) => setNodeType(e)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Node type" />
        </SelectTrigger>
        <SelectContent>
        
          <SelectItem value="Normal">Normal</SelectItem>
          <SelectItem value="Start">Start</SelectItem>
          <SelectItem value="Goal">Goal</SelectItem>
          
          </SelectContent>
        </Select>
        <Button onClick={addNode}>Add Node</Button>
        <Input
          placeholder="Edge Cost"
          type="number"
          value={edgeCost}
          onChange={(e) => setEdgeCost(e.target.value)}
        />
        <Button onClick={bfsSearch}>Run BFS</Button>
        <Button onClick={dfsSearch}>Run DFS</Button>
        <Button onClick={aStarSearch}>Run A* Search</Button>
      </div>
      <div className="flex-grow">
      <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            style: {
              backgroundColor: highlightedNodes.includes(node.id) ? "lightblue" : "white",
              border: node.data.type === "Start" ? "2px solid green" : node.data.type === "Goal" ? "2px solid red" : "1px solid black",
            },
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      {searchResult && <div className="p-4 bg-gray-100">{searchResult}</div>}
    </div>
  );
}