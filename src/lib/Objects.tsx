import { Objects as ObjectsI, Object as ObjectI } from './rdf-json'
import React, { useMemo } from 'react'
import { useViewerContext } from './viewer-context'
import Qualifiers from './Qualifiers'
import SimpleObject from './SimpleObject'
import { usePredicateContext } from './predicate-context'
import SeeMoreButton from './SeeMoreButton'
import { compareObjects, isStandardReifiedStatement } from './common'

interface Props {
  objects: ObjectsI
}

function Objects (props: Props): JSX.Element {
  const { objects } = props

  const viewerCtx = useViewerContext()
  const { data, labelIRIs } = viewerCtx
  if (data === undefined) throw new Error('Objects: data is undefined')
  const { howManyVisibleObjects, setHowManyVisibleObjects } = usePredicateContext()

  const sortedObjects = useMemo(() => objects.sort((a, b) => compareObjects(viewerCtx, a, b)), [objects])

  // Make groups of objects based on whether they are bnodes or not
  const groups = useMemo(() => {
    const groups: ObjectI[][] = []
    sortedObjects.forEach((object) => {
      const lastGroup = groups.length === 0 ? undefined : groups[groups.length - 1]
      // No groups yet:
      const noLastGroup = lastGroup === undefined
      // Switched from bnode to non-bnode or vice-versa:
      const bnodeSwitched = lastGroup !== undefined && [lastGroup[0].type, object.type].filter((t) => t === 'bnode').length === 1
      const haveToCreateNewGroup = noLastGroup || bnodeSwitched
      if (haveToCreateNewGroup) {
        groups.push([object])
      } else {
        lastGroup.push(object)
      }
    })
    return groups
  }, [sortedObjects])

  // Remove bnodes that are not in the data
  const filteredGroups = useMemo(() => {
    return groups.map((group) => {
      return group.filter((obj) => {
        if (obj.type !== 'bnode' || data === undefined) {
          return true
        }
        const entity = data[obj.value]
        return entity !== undefined
      })
    }).filter((group) => group.length > 0)
  }, [groups, data])

  const showSeeMore = useMemo(() => filteredGroups.flat().length > howManyVisibleObjects, [filteredGroups, howManyVisibleObjects])

  const visibleObjects = useMemo(() => {
    return filteredGroups.flat().slice(0, howManyVisibleObjects)
  }, [filteredGroups, howManyVisibleObjects])

  return (
    <>
      {visibleObjects.map((object, objectIndex): JSX.Element => (
        isStandardReifiedStatement(data, object, labelIRIs)
          ? <Qualifiers key={objectIndex} object={object} />
          : <SimpleObject key={objectIndex} object={object} />
      ))}

      {showSeeMore && (
        <SeeMoreButton onClick={() => setHowManyVisibleObjects(filteredGroups.flat().length)} />
      )}
    </>
  )
}

export default Objects
