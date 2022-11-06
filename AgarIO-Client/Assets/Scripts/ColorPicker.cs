using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ColorPicker : MonoBehaviour
{
    public List<Material> mats = new List<Material>();

    // Start is called before the first frame update
    void Start()
    {
        GetComponent<Renderer>().material = mats[Random.Range(0, 4)];
    }
}
