import React, { useState, useEffect } from 'react';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../../lib/api';

const SortableItem = ({ id, camper }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 mb-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-md transition-shadow relative"
    >
      <div className="font-semibold text-gray-800">
        {camper.first_name || camper.name} {camper.last_name}
      </div>
      {camper.age && <div className="text-sm text-gray-500 mt-1">Age: {camper.age}</div>}
    </div>
  );
};

const DroppableContainer = ({ id, title, items }) => {
  const { setNodeRef } = useDroppable({ id });
  
  return (
    <div className="flex flex-col bg-gray-50 rounded-xl p-5 h-full border border-gray-200 shadow-inner">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="flex-1 bg-gray-100/50 rounded-lg p-2 min-h-[200px]">
        <SortableContext id={id} items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div ref={setNodeRef} className="h-full min-h-[200px]">
            {items.map(camper => (
              <SortableItem key={camper.id} id={camper.id} camper={camper} />
            ))}
            {items.length === 0 && (
              <div className="flex items-center justify-center h-32 text-sm text-gray-400 italic border-2 border-dashed border-gray-300 rounded-lg">
                Drop campers here
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default function CabinAssignment() {
  const [groups, setGroups] = useState([]);
  const [containers, setContainers] = useState({ unassigned: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [campersRes, groupsRes] = await Promise.all([
        api.get('/campers'),
        api.get('/groups')
      ]);
      
      const fetchedCampers = campersRes.data || [];
      const fetchedGroups = groupsRes.data || [];
      
      setGroups(fetchedGroups);
      
      const newContainers = { unassigned: [] };
      fetchedGroups.forEach(g => newContainers[g.id] = []);
      
      fetchedCampers.forEach(c => {
        const groupId = c.group_id || c.groupId; 
        if (groupId && newContainers[groupId]) {
          newContainers[groupId].push(c);
        } else {
          newContainers.unassigned.push(c);
        }
      });
      
      setContainers(newContainers);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id) => {
    if (id in containers) return id;
    return Object.keys(containers).find((key) =>
      containers[key].find((item) => item.id === id)
    );
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = overId in containers ? overId : findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setContainers((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex(i => i.id === activeId);
      const overIndex = overId in containers ? overItems.length : overItems.findIndex(i => i.id === overId);
      
      return {
        ...prev,
        [activeContainer]: prev[activeContainer].filter(item => item.id !== activeId),
        [overContainer]: [
          ...prev[overContainer].slice(0, overIndex),
          activeItems[activeIndex],
          ...prev[overContainer].slice(overIndex, prev[overContainer].length)
        ]
      };
    });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = overId in containers ? overId : findContainer(overId);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const items = containers[activeContainer];
      const activeIndex = items.findIndex(i => i.id === activeId);
      const overIndex = items.findIndex(i => i.id === overId);

      if (activeIndex !== overIndex) {
        setContainers(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex)
        }));
      }
    } else {
      if (overContainer !== 'unassigned') {
        try {
          await api.post(`/groups/${overContainer}/assign`, { camper_id: activeId });
        } catch (error) {
          console.error("Failed to assign camper", error);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-medium text-gray-500 animate-pulse">Loading assignment interface...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Cabin Assignment</h1>
        <p className="text-gray-600 mt-2">Drag and drop campers to assign them to cabins.</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <DroppableContainer 
              id="unassigned" 
              title="Unassigned Campers" 
              items={containers.unassigned || []} 
            />
          </div>

          <div className="w-full lg:w-2/3 xl:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.map(group => (
                <div key={group.id} className="min-h-[300px]">
                  <DroppableContainer 
                    id={group.id.toString()} 
                    title={group.name} 
                    items={containers[group.id] || []} 
                  />
                </div>
              ))}
              {groups.length === 0 && (
                <div className="col-span-full p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                  No cabins or groups available.
                </div>
              )}
            </div>
          </div>
          
        </div>
      </DndContext>
    </div>
  );
}
