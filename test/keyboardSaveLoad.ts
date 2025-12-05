import { KeyboardInstance, KeyboardPersistence, KeyboardSize } from '@lib/keyboardDefinition'
import { frthenKeyboard } from '@lib/keyboardDefinitions/eng_frthen'
import { qwertyAlphabet } from '@lib/keyboardDefinitions/eng_qwerty'
import KeyLabel, { ZoneKey } from '@lib/keyLabel'
import { describe } from 'mocha'
import assert from 'node:assert'
import { writeFileSync } from 'node:fs'
import path from 'node:path'

const testDirPath = 'test'

describe('keyboard', () => {
  describe('save and load', () => {
    it('saves and loads as json format', () => {
      for (let keyboard of [frthenKeyboard, qwertyAlphabet]) {
        const kbi1 = new KeyboardInstance(keyboard, {
          persistence: KeyboardPersistence.Indefinite,
          size: KeyboardSize.Fill,
          name: `${keyboard.name}1`
        })

        const kbiStr = kbi1.save()
        writeFileSync(path.join(testDirPath, `${kbi1.keyboard.name}.keyboard.json`), kbiStr)
        const kbi2 = KeyboardInstance.load(kbiStr)
        writeFileSync(path.join(testDirPath, `${kbi1.keyboard.name}-copy.keyboard.json`), kbi2.save())

        assert(
          kbi1.equals(kbi2), 
          `${keyboard.name} keyboard mismatch before and after save+load`
        )

        kbi2.keyboard.name = `${keyboard.name}2`
        assert(kbi1.equals(kbi2, false), `keyboard name-agnostic mismatch before and after rename`)

        const kbi3 = KeyboardInstance.load(kbiStr, { keyOverrides: [
          {row: 0, col: 0, key: {
            label: new KeyLabel([
              [new ZoneKey('center'), '']
            ])
          }}
        ] })
        assert(
          !kbi1.equals(kbi3), 
          `${keyboard.name} keyboards still match after attempting key override`
        )
      }
    })
  })
})