using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FoodSpawner : MonoBehaviour
{
    public GameObject Food;
    public float Speed;

    // Start is called before the first frame update
    void Start()
    {
       // InvokeRepeating("FoodGenerate", 0, Speed);
    }
    
    void FoodGenerate()
    {
        int x = Random.Range(0, Camera.main.pixelWidth);
        int y = Random.Range(0, Camera.main.pixelHeight);

        Vector3 target = Camera.main.ScreenToWorldPoint(new Vector3(x,y,0));
        target.z = 0;
        Instantiate(Food, target, Quaternion.identity);
    }
}
