using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System;

public class FoodEat : MonoBehaviour
{
    public float SizeIncrease;
    public Text scoreBoard;
    int Score = 0;

    void OnTriggerEnter(Collider other)
    {
        if (other.gameObject.tag == "Food")
        {
            transform.localScale += new Vector3(SizeIncrease, SizeIncrease, SizeIncrease);
            Score += 10;
            WebsocketClient.GetInstance().SendEatFood(Int32.Parse(other.gameObject.name), transform.localScale.x);
            other.gameObject.SetActive(false);
            //scoreBoard.text = "Score : " + Score;
            //Destroy(other.gameObject);
        }
    }
}
